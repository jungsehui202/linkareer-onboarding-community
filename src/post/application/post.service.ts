import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(input: CreatePostInput & { authorId: number }) {
    return this.prisma.post.create({
      data: input,
    });
  }

  async findMany(filter?: PostFilterInput): Promise<Post[]> {
    const where: Prisma.PostWhereInput = {};

    if (filter?.boardId) {
      where.boardId = filter.boardId;
    }

    if (filter?.authorId) {
      where.authorId = filter.authorId;
    }

    if (filter?.searchKeyword) {
      where.OR = [
        { title: { contains: filter.searchKeyword } },
        { content: { contains: filter.searchKeyword } },
      ];
    }

    if (filter?.minViewCount !== undefined) {
      where.viewCount = { gte: filter.minViewCount };
    }

    if (filter?.minScrapCount !== undefined) {
      where.scrapCount = { gte: filter.minScrapCount };
    }

    // 정렬 로직 동적 처리 --> (인기순 / 최신순)
    let orderBy: Prisma.PostOrderByWithRelationInput = { createdAt: 'desc' };

    // 만약 조회수 필터가 걸려있다면 인기순으로 정렬
    if (filter?.minViewCount !== undefined) {
      orderBy = { viewCount: 'desc' };
    }

    return this.prisma.post.findMany({
      where,
      skip: filter?.skip || 0,
      take: filter?.take || 20,
      orderBy, // 동적으로 설정된 정렬 기준 적용
    });
  }

  async findById(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async findByIdWithViewIncrement(id: number): Promise<Post> {
    const post = await this.findById(id);

    // 조회수 증가 (비동기, 에러 무시)
    this.incrementViewCount(id).catch(() => {
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

  async delete(id: number): Promise<Post> {
    await this.findById(id);

    return this.prisma.post.delete({
      where: { id },
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

  private async incrementViewCount(id: number): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
    });
  }
}
