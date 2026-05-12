import { Inject, Injectable } from '@nestjs/common';
import { UserRolePolicy } from '../../../user/domain/value-objects/user-role.vo';
import { Board } from '../../domain/entities/board.entity';
import { BoardNotFoundException } from '../../domain/exceptions/board.exceptions';
import {
  BOARD_REPOSITORY,
  BoardRepository,
} from '../../domain/repositories/board.repository';
import { BoardFilterQuery } from '../dto/board-filter.query';

@Injectable()
export class BoardService {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepository,
  ) {}

  async findMany(filter?: BoardFilterQuery): Promise<Board[]> {
    const requiredRoles = filter?.userRole
      ? UserRolePolicy.allowedRoles(filter.userRole)
      : undefined;

    return this.boardRepository.findMany({
      requiredRoles,
      parentId: filter?.parentId,
      slug: filter?.slug,
      searchKeyword: filter?.searchKeyword,
    });
  }

  async findById(id: number): Promise<Board> {
    const board = await this.boardRepository.findById(id);
    if (!board) {
      throw new BoardNotFoundException(id);
    }
    return board;
  }

  async findBySlug(slug: string): Promise<Board> {
    const board = await this.boardRepository.findBySlug(slug);
    if (!board) {
      throw new BoardNotFoundException(slug);
    }
    return board;
  }

  async findByIds(ids: number[]): Promise<Board[]> {
    return this.boardRepository.findByIds(ids);
  }

  async findChildrenOf(parentId: number): Promise<Board[]> {
    return this.boardRepository.findChildrenOf(parentId);
  }

  async findChildrenOfMany(parentIds: number[]): Promise<Map<number, Board[]>> {
    return this.boardRepository.findChildrenOfMany(parentIds);
  }
}
