import { Post } from '../entities/post.entity';

export const POST_REPOSITORY = Symbol('POST_REPOSITORY');

export interface PostQuery {
  boardId?: number;
  authorId?: number;
  searchKeyword?: string;
  minViewCount?: number;
  minScrapCount?: number;
  skip?: number;
  take?: number;
  orderByViewCountDesc?: boolean;
}

export interface PostSearchHit {
  post: Post;
  rank: number;
}

export interface PostRepository {
  save(post: Post): Promise<Post>;
  findMany(query?: PostQuery): Promise<Post[]>;
  findById(id: number): Promise<Post | null>;
  findBest(take: number, minViewCount?: number): Promise<Post[]>;
  fullTextSearch(
    keyword: string,
    take: number,
    skip: number,
  ): Promise<PostSearchHit[]>;
  incrementSearchCounts(ids: number[]): Promise<void>;
  countByBoardIds(boardIds: number[]): Promise<Map<number, number>>;
}

export const SCRAP_REPOSITORY = Symbol('SCRAP_REPOSITORY');

export interface ScrapRepository {
  exists(userId: number, postId: number): Promise<boolean>;
}
