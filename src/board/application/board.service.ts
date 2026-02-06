import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRoleUtils } from '../../user/domain/user.entity';
import { Board } from '../domain/board.entity';
import { BoardFilterInput } from '../presentation/dto/board.input';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(filter?: BoardFilterInput): Promise<Board[]> {
    const where: Prisma.BoardWhereInput = {};

    if (filter?.userRole) {
      const allowedRoles = UserRoleUtils.getAllowedRoles(filter.userRole);
      where.requiredRole = { in: allowedRoles };
    }

    if (filter?.parentId !== undefined) {
      where.parentId = filter.parentId;
    }

    if (filter?.slug) {
      where.slug = filter.slug;
    }

    if (filter?.searchKeyword) {
      where.OR = [
        { name: { contains: filter.searchKeyword } },
        { description: { contains: filter.searchKeyword } },
      ];
    }

    return this.prisma.board.findMany({
      where,
      orderBy: { id: 'asc' },
    });
  }

  async findById(id: number): Promise<Board> {
    const board = await this.prisma.board.findUnique({
      where: { id },
    });

    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    return board;
  }

  async findBySlug(slug: string): Promise<Board> {
    const board = await this.prisma.board.findUnique({
      where: { slug },
    });

    if (!board) {
      throw new NotFoundException(`Board with slug '${slug}' not found`);
    }

    return board;
  }

  async findParentBoard(parentId: number | null): Promise<Board | null> {
    if (!parentId) return null;

    return this.prisma.board.findUnique({
      where: { id: parentId },
    });
  }

  async findChildBoards(parentId: number): Promise<Board[]> {
    return this.prisma.board.findMany({
      where: { parentId },
      orderBy: { id: 'asc' },
    });
  }

  async getPostCount(boardId: number): Promise<number> {
    return this.prisma.post.count({
      where: { boardId },
    });
  }
}
