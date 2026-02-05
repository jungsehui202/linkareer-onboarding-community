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
  constructor(private prisma: PrismaService) {}

  async create(input: CreatePostInput): Promise<Post> {
    return this.prisma.post.create({
      data: input,
    });
  }

  async findMany(filter?: PostFilterInput): Promise<Post[]> {
    const where: Prisma.PostWhereInput = {};

    // 게시판 필터링
    if (filter?.boardId) {
      where.boardId = filter.boardId;
    }

    // 작성자 필터링
    if (filter?.authorId) {
      where.authorId = filter.authorId;
    }

    // 검색어 필터링 (제목 + 내용)
    if (filter?.searchKeyword) {
      where.OR = [
        { title: { contains: filter.searchKeyword } },
        { content: { contains: filter.searchKeyword } },
      ];
    }

    // 조회수 필터링 (BEST 게시판)
    if (filter?.minViewCount !== undefined) {
      where.viewCount = { gte: filter.minViewCount };
    }

    // 스크랩 수 필터링 (인기 게시글)
    if (filter?.minScrapCount !== undefined) {
      where.scrapCount = { gte: filter.minScrapCount };
    }

    return this.prisma.post.findMany({
      where,
      skip: filter?.skip || 0,
      take: filter?.take || 20,
      orderBy: { createdAt: 'desc' },
    });
  }

  // 게시글 상세 조회 (조회수 자동 증가)
  // TODO: 조회수 자동 증가 하면 안 되는 거로 수정하기 !!
  async findById(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // 조회수 증가 (비동기, 에러 무시)
    // → 조회수 증가 실패가 게시글 조회를 막아서는 안 됨
    this.incrementViewCount(id).catch(() => {
      // 로깅만 하고 에러는 무시
      console.warn(`Failed to increment view count for post ${id}`);
    });

    return post;
  }

  // 게시글 수정
  async update(id: number, input: UpdatePostInput): Promise<Post> {
    // 존재 확인
    await this.findByIdWithoutIncrement(id);

    return this.prisma.post.update({
      where: { id },
      data: {
        title: input.title,
        content: input.content,
        boardId: input.boardId,
      },
    });
  }

  // 게시글 삭제 (Hard Delete)
  async delete(id: number): Promise<Post> {
    // 존재 확인
    await this.findByIdWithoutIncrement(id);

    return this.prisma.post.delete({
      where: { id },
    });
  }

  // 조회수 증가 (비동기)
  private async incrementViewCount(id: number): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
    });
  }

  // 게시글 조회 (조회수 증가 없이)
  // 수정/삭제 시 존재 확인용
  private async findByIdWithoutIncrement(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }
}
