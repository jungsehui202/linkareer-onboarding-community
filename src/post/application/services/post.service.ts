import { Inject, Injectable, Logger } from '@nestjs/common';
import { Post } from '../../domain/entities/post.entity';
import {
  InvalidSearchKeywordException,
  PostNotFoundException,
} from '../../domain/exceptions/post.exceptions';
import {
  POST_REPOSITORY,
  PostRepository,
  PostSearchHit,
  SCRAP_REPOSITORY,
  ScrapRepository,
} from '../../domain/repositories/post.repository';
import { CreatePostCommand } from '../dto/create-post.command';
import { DeletePostCommand } from '../dto/delete-post.command';
import { PostFilterQuery } from '../dto/post-filter.query';
import { UpdatePostCommand } from '../dto/update-post.command';

const BEST_POST_MIN_VIEWS = 10;
const MAX_KEYWORD_LENGTH = 100;
const KEYWORD_SANITIZE_REGEX = /[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g;

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
    @Inject(SCRAP_REPOSITORY)
    private readonly scrapRepository: ScrapRepository,
  ) {}

  async create(command: CreatePostCommand): Promise<Post> {
    const post = Post.create({
      title: command.title,
      content: command.content,
      boardId: command.boardId,
      authorId: command.authorId,
    });
    return this.postRepository.save(post);
  }

  async findMany(filter?: PostFilterQuery): Promise<Post[]> {
    return this.postRepository.findMany({
      ...filter,
      orderByViewCountDesc: filter?.minViewCount !== undefined,
    });
  }

  async findById(id: number): Promise<Post> {
    const post = await this.postRepository.findById(id);
    if (!post || post.isDeleted) {
      throw new PostNotFoundException(id);
    }
    return post;
  }

  async viewById(id: number): Promise<Post> {
    const post = await this.findById(id);

    void this.applyView(id).catch((err) => {
      this.logger.warn(`Failed to increment view count for post ${id}: ${err}`);
    });

    return post;
  }

  async findBest(take: number): Promise<Post[]> {
    return this.postRepository.findBest(take, BEST_POST_MIN_VIEWS);
  }

  async searchWithStats(
    keyword: string,
    take: number,
    skip: number,
  ): Promise<PostSearchHit[]> {
    if (!keyword || keyword.trim().length === 0) {
      return [];
    }
    if (keyword.length > MAX_KEYWORD_LENGTH) {
      throw new InvalidSearchKeywordException(
        '검색어는 100자 이하로 입력해 주세요.',
      );
    }

    const sanitized = keyword.replace(KEYWORD_SANITIZE_REGEX, '').trim();
    if (sanitized.length === 0) {
      return [];
    }

    const hits = await this.postRepository.fullTextSearch(
      sanitized,
      take,
      skip,
    );

    if (hits.length > 0) {
      void this.postRepository
        .incrementSearchCounts(hits.map((h) => h.post.id))
        .catch(() => this.logger.warn('Failed to update search counts'));
    }

    return hits;
  }

  async update(command: UpdatePostCommand): Promise<Post> {
    const post = await this.findById(command.id);
    post.assertCanBeModifiedBy(command.actorId, command.isActorAdmin);
    post.update({
      title: command.title,
      content: command.content,
      boardId: command.boardId,
    });
    return this.postRepository.save(post);
  }

  async delete(command: DeletePostCommand): Promise<Post> {
    const post = await this.findById(command.id);
    post.assertCanBeModifiedBy(command.actorId, command.isActorAdmin);
    post.softDelete();
    return this.postRepository.save(post);
  }

  async isScrapedBy(postId: number, userId: number): Promise<boolean> {
    return this.scrapRepository.exists(userId, postId);
  }

  async countByBoardIds(boardIds: number[]): Promise<Map<number, number>> {
    return this.postRepository.countByBoardIds(boardIds);
  }

  private async applyView(id: number): Promise<void> {
    const post = await this.postRepository.findById(id);
    if (!post || post.isDeleted) return;
    post.incrementView();
    await this.postRepository.save(post);
  }
}
