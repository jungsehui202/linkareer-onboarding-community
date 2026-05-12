import { Post as PrismaPost } from '@prisma/client';
import { Post } from '../../domain/entities/post.entity';

export class PostMapper {
  static toDomain(record: PrismaPost): Post {
    return Post.rehydrate({
      id: record.id,
      title: record.title,
      content: record.content,
      viewCount: record.viewCount,
      scrapCount: record.scrapCount,
      searchCount: record.searchCount,
      popularityScore: record.popularityScore,
      authorId: record.authorId,
      boardId: record.boardId,
      deletedAt: record.deletedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toCreateInput(post: Post) {
    const s = post.toSnapshot();
    return {
      title: s.title,
      content: s.content,
      viewCount: s.viewCount,
      scrapCount: s.scrapCount,
      searchCount: s.searchCount,
      popularityScore: s.popularityScore,
      authorId: s.authorId,
      boardId: s.boardId,
      deletedAt: s.deletedAt,
    };
  }

  static toUpdateInput(post: Post) {
    const s = post.toSnapshot();
    return {
      title: s.title,
      content: s.content,
      viewCount: s.viewCount,
      scrapCount: s.scrapCount,
      searchCount: s.searchCount,
      popularityScore: s.popularityScore,
      authorId: s.authorId,
      boardId: s.boardId,
      deletedAt: s.deletedAt,
    };
  }

  static fromRawRow(row: any): Post {
    return Post.rehydrate({
      id: row.id,
      title: row.title,
      content: row.content,
      viewCount: row.view_count ?? row.viewCount ?? 0,
      scrapCount: row.scrap_count ?? row.scrapCount ?? 0,
      searchCount: row.search_count ?? row.searchCount ?? 0,
      popularityScore: row.popularity_score ?? row.popularityScore ?? 0,
      authorId: row.author_id ?? row.authorId ?? null,
      boardId: row.board_id ?? row.boardId,
      deletedAt: row.deleted_at ?? row.deletedAt ?? null,
      createdAt: row.created_at ?? row.createdAt,
      updatedAt: row.updated_at ?? row.updatedAt,
    });
  }
}
