import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { UserRoleUtils } from '../../user/domain/user-role.utils';
import { BoardEntity } from '../domain/board.entity';
import { BoardPrisma } from '../domain/board.prisma';

@Injectable()
export class BoardService {
  constructor(private readonly boardPrisma: BoardPrisma) {}

  async findAllByUserRole(userRole: UserRole): Promise<BoardEntity[]> {
    const allowedRoles = UserRoleUtils.getAllowedRoles(userRole);
    const boards = await this.boardPrisma.findAllByUserRole(allowedRoles);
    return boards;
  }

  async findBoardById(id: number): Promise<BoardEntity> {
    const board = await this.boardPrisma.findById(id);
    return board;
  }

  async findBoardBySlug(slug: string): Promise<BoardEntity | null> {
    const board = await this.boardPrisma.findBySlug(slug);
    return board;
  }

  async findChildBoards(parentId: number): Promise<BoardEntity[]> {
    const children = await this.boardPrisma.findChildren(parentId);
    return children;
  }

  async findAllBoards(): Promise<BoardEntity[]> {
    const boards = await this.boardPrisma.findAll();
    return boards;
  }
}
