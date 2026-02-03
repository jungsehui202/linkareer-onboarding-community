import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BoardNotFoundException } from '../exception/board.exception';
import { BoardEntity } from './board.entity';

@Injectable()
export class BoardPrisma {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUserRole(allowedRoles: UserRole[]): Promise<BoardEntity[]> {
    const boards = await this.prisma.board.findMany({
      where: {
        requiredRole: {
          in: allowedRoles,
        },
      },
      orderBy: { id: 'asc' },
    });

    return boards.map((board) => BoardEntity.fromPrisma(board));
  }

  async findById(id: number): Promise<BoardEntity> {
    const board = await this.prisma.board.findUnique({
      where: { id },
    });

    if (!board) {
      throw new BoardNotFoundException(id);
    }

    return BoardEntity.fromPrisma(board);
  }

  async findBySlug(slug: string): Promise<BoardEntity | null> {
    const board = await this.prisma.board.findUnique({
      where: { slug },
    });

    if (!board) {
      return null;
    }

    return BoardEntity.fromPrisma(board);
  }

  async findAll(): Promise<BoardEntity[]> {
    const boards = await this.prisma.board.findMany({
      orderBy: { id: 'asc' },
    });

    return boards.map((board) => BoardEntity.fromPrisma(board));
  }

  async findChildren(parentId: number): Promise<BoardEntity[]> {
    const children = await this.prisma.board.findMany({
      where: { parentId },
      orderBy: { id: 'asc' },
    });

    return children.map((board) => BoardEntity.fromPrisma(board));
  }
}
