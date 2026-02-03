import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { BoardService } from '../application/board.service';
import { BoardEntity } from '../domain/board.entity';
import { BoardResponse } from './response/board-response.dto';

@Resolver(() => BoardResponse)
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Query(() => [BoardResponse], {
    name: 'boards',
    description: '게시판 목록 (권한별 필터링)',
  })
  async findAll(
    @Args('userRole', { type: () => UserRole, defaultValue: UserRole.USER })
    userRole: UserRole,
  ): Promise<BoardResponse[]> {
    const boards: BoardEntity[] =
      await this.boardService.findAllByUserRole(userRole);
    const boardResponses = BoardResponse.fromList(boards);
    return boardResponses;
  }

  @Query(() => BoardResponse, {
    name: 'board',
    description: '게시판 상세 조회',
  })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<BoardResponse> {
    const board: BoardEntity = await this.boardService.findBoardById(id);
    const boardResponse = BoardResponse.from(board);
    return boardResponse;
  }

  @Query(() => BoardResponse, {
    name: 'boardBySlug',
    description: 'Slug로 게시판 조회',
    nullable: true,
  })
  async findBySlug(@Args('slug') slug: string): Promise<BoardResponse | null> {
    const board: BoardEntity | null =
      await this.boardService.findBoardBySlug(slug);

    if (!board) {
      return null;
    }

    const boardResponse = BoardResponse.from(board);
    return boardResponse;
  }

  @Query(() => [BoardResponse], {
    name: 'childBoards',
    description: '하위 게시판 목록',
  })
  async findChildren(
    @Args('parentId', { type: () => Int }) parentId: number,
  ): Promise<BoardResponse[]> {
    const children: BoardEntity[] =
      await this.boardService.findChildBoards(parentId);
    const childResponses = BoardResponse.fromList(children);
    return childResponses;
  }
}
