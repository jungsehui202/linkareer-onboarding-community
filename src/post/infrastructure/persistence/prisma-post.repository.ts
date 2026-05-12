import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { Post } from '../../domain/entities/post.entity';
import {
  PostQuery,
  PostRepository,
  PostSearchHit,
} from '../../domain/repositories/post.repository';
import { PostMapper } from './post.mapper';

@Injectable()
export class PrismaPostRepository implements PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(post: Post): Promise<Post> {
    if (post.id === 0) {
      const created = await this.prisma.post.create({
        data: PostMapper.toCreateInput(post),
      });
      return PostMapper.toDomain(created);
    }
    const updated = await this.prisma.post.update({
      where: { id: post.id },
      data: PostMapper.toUpdateInput(post),
    });
    return PostMapper.toDomain(updated);
  }

  async findMany(query?: PostQuery): Promise<Post[]> {
    const where: Prisma.PostWhereInput = { deletedAt: null };

    if (query?.boardId) where.boardId = query.boardId;
    if (query?.authorId) where.authorId = query.authorId;
    if (query?.searchKeyword) {
      where.OR = [
        { title: { contains: query.searchKeyword, mode: 'insensitive' } },
        { content: { contains: query.searchKeyword, mode: 'insensitive' } },
      ];
    }
    if (query?.minViewCount !== undefined) {
      where.viewCount = { gte: query.minViewCount };
    }
    if (query?.minScrapCount !== undefined) {
      where.scrapCount = { gte: query.minScrapCount };
    }

    const orderBy: Prisma.PostOrderByWithRelationInput =
      query?.orderByViewCountDesc
        ? { viewCount: 'desc' }
        : { createdAt: 'desc' };

    const records = await this.prisma.post.findMany({
      where,
      skip: query?.skip ?? 0,
      take: query?.take ?? 20,
      orderBy,
    });
    return records.map(PostMapper.toDomain);
  }

  async findById(id: number): Promise<Post | null> {
    const record = await this.prisma.post.findUnique({ where: { id } });
    return record ? PostMapper.toDomain(record) : null;
  }

  async findBest(take: number, minViewCount = 10): Promise<Post[]> {
    const records = await this.prisma.post.findMany({
      where: { deletedAt: null, viewCount: { gte: minViewCount } },
      orderBy: [{ popularityScore: 'desc' }, { createdAt: 'desc' }],
      take,
    });
    return records.map(PostMapper.toDomain);
  }

  async fullTextSearch(
    keyword: string,
    take: number,
    skip: number,
  ): Promise<PostSearchHit[]> {
    const rows = await this.prisma.$queryRaw<any[]>`
      SELECT
        p.*,
        ts_rank(
          to_tsvector('simple', COALESCE(p.title, '') || ' ' || COALESCE(p.content, '')),
          plainto_tsquery('simple', ${keyword})
        ) AS rank
      FROM posts p
      WHERE
        p.deleted_at IS NULL
        AND to_tsvector('simple', COALESCE(p.title, '') || ' ' || COALESCE(p.content, ''))
          @@ plainto_tsquery('simple', ${keyword})
      ORDER BY rank DESC, p.created_at DESC
      LIMIT ${take}
      OFFSET ${skip}
    `;

    return rows.map((row) => ({
      post: PostMapper.fromRawRow(row),
      rank: Number(row.rank ?? 0),
    }));
  }

  async incrementSearchCounts(ids: number[]): Promise<void> {
    if (ids.length === 0) return;
    await this.prisma.post.updateMany({
      where: { id: { in: ids } },
      data: { searchCount: { increment: 1 } },
    });
  }

  async countByBoardIds(boardIds: number[]): Promise<Map<number, number>> {
    if (boardIds.length === 0) return new Map();

    const counts = await this.prisma.post.groupBy({
      by: ['boardId'],
      where: { boardId: { in: boardIds }, deletedAt: null },
      _count: { id: true },
    });

    const map = new Map<number, number>();
    boardIds.forEach((id) => map.set(id, 0));
    counts.forEach((c) => map.set(c.boardId, c._count.id));
    return map;
  }
}
