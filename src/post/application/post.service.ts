import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Post } from '../domain/post.entity';
import {
  CreatePostInput,
  PostFilterInput,
  UpdatePostInput,
} from '../presentation/dto/post.input';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreatePostInput & { authorId: number }): Promise<Post> {
    return this.prisma.post.create({
      data: {
        ...input,
        popularityScore: 0, // 초기값
      },
    });
  }

  async findMany(filter?: PostFilterInput): Promise<Post[]> {
    const where: Prisma.PostWhereInput = {
      deletedAt: null, // Soft Delete 제외
    };

    if (filter?.boardId) {
      where.boardId = filter.boardId;
    }

    if (filter?.authorId) {
      where.authorId = filter.authorId;
    }

    if (filter?.searchKeyword) {
      where.OR = [
        { title: { contains: filter.searchKeyword, mode: 'insensitive' } },
        { content: { contains: filter.searchKeyword, mode: 'insensitive' } },
      ];
    }

    if (filter?.minViewCount !== undefined) {
      where.viewCount = { gte: filter.minViewCount };
    }

    if (filter?.minScrapCount !== undefined) {
      where.scrapCount = { gte: filter.minScrapCount };
    }

    let orderBy: Prisma.PostOrderByWithRelationInput = { createdAt: 'desc' };

    if (filter?.minViewCount !== undefined) {
      orderBy = { viewCount: 'desc' };
    }

    return this.prisma.post.findMany({
      where,
      skip: filter?.skip || 0,
      take: filter?.take || 20,
      orderBy,
    });
  }

  async searchPostsWithSearchCountsIncrement(
    keyword: string,
    take: number = 20,
    skip: number = 0,
  ): Promise<Post[]> {
    if (!keyword || keyword.trim().length === 0) {
      return [];
    }

    if (keyword.length > 100) {
      throw new BadRequestException('검색어는 100자 이하로 입력해 주세요.');
    }

    const sanitized = keyword.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '').trim();

    if (sanitized.length === 0) {
      return [];
    }

    const posts = await this.prisma.$queryRaw<Post[]>`
      SELECT
        p.*,
        ts_rank(
          to_tsvector('simple', COALESCE(p.title, '') || ' ' || COALESCE(p.content, '')),
          plainto_tsquery('simple', ${sanitized})
        ) AS rank
      FROM posts p
      WHERE
        p.deleted_at IS NULL
        AND to_tsvector('simple', COALESCE(p.title, '') || ' ' || COALESCE(p.content, ''))
          @@ plainto_tsquery('simple', ${sanitized})
      ORDER BY rank DESC, p.created_at DESC
      LIMIT ${take}
      OFFSET ${skip}
    `;

    if (posts.length > 0) {
      this.incrementSearchCounts(posts.map((p) => p.id)).catch(() => {
        console.warn('Failed to update search counts');
      });
    }

    return posts;
  }

  async findBestPosts(take: number = 20): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        deletedAt: null,
        viewCount: { gte: 10 }, // ← Partial Index 조건
      },
      orderBy: [{ popularityScore: 'desc' }, { createdAt: 'desc' }],
      take,
    });
  }

  async findById(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post || post.deletedAt) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async findByIdWithViewIncrement(id: number): Promise<Post> {
    const post = await this.findById(id);

    // 조회수 증가 + popularityScore 업데이트
    this.incrementViewCountAndPopularity(id).catch(() => {
      console.warn(`Failed to increment view count for post ${id}`);
    });

    return post;
  }

  async update(id: number, input: UpdatePostInput): Promise<Post> {
    await this.findById(id);

    return this.prisma.post.update({
      where: { id },
      data: {
        title: input.title,
        content: input.content,
        boardId: input.boardId,
      },
    });
  }

  async incrementScrapCount(postId: number): Promise<void> {
    await this.prisma.post.update({
      where: { id: postId },
      data: {
        scrapCount: { increment: 1 },
        popularityScore: { increment: 50 }, // scrap_count * 50
      },
    });
  }

  async decrementScrapCount(postId: number): Promise<void> {
    await this.prisma.post.update({
      where: { id: postId },
      data: {
        scrapCount: { decrement: 1 },
        popularityScore: { decrement: 50 },
      },
    });
  }

  async delete(id: number): Promise<Post> {
    await this.findById(id);

    return this.prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async isScrapedByUser(postId: number, userId: number): Promise<boolean> {
    const scrap = await this.prisma.scrap.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return !!scrap;
  }

  private async incrementViewCountAndPopularity(id: number): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
        popularityScore: { increment: 5 }, // view_count * 5
      },
    });
  }

  private async incrementSearchCounts(postIds: number[]): Promise<void> {
    await this.prisma.post.updateMany({
      where: { id: { in: postIds } },
      data: {
        searchCount: { increment: 1 },
      },
    });
  }
}
