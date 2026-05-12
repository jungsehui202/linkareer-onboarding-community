import {
  Args,
  Context,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLContext } from '../../../common/graphql/context/graphqh-context.interface';
import { BoardService } from '../../application/services/board.service';
import { BoardFilterInput } from '../graphql/inputs/board-filter.input';
import { BoardViewMapper } from '../graphql/mappers/board.view-mapper';
import { BoardView } from '../graphql/types/board.type';

@Resolver(() => BoardView)
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Query(() => [BoardView], {
    name: 'boards',
    description: '게시판 목록 (필터링)',
  })
  async boards(
    @Args('filter', { nullable: true }) filter?: BoardFilterInput,
  ): Promise<BoardView[]> {
    const boards = await this.boardService.findMany(filter);
    return boards.map(BoardViewMapper.toView);
  }

  @Query(() => BoardView, {
    name: 'board',
    description: '게시판 단건 조회 (ID)',
    nullable: false,
  })
  async board(@Args('id', { type: () => Int }) id: number): Promise<BoardView> {
    const board = await this.boardService.findById(id);
    return BoardViewMapper.toView(board);
  }

  @Query(() => BoardView, {
    name: 'boardBySlug',
    description: '게시판 단건 조회 (Slug)',
    nullable: false,
  })
  async boardBySlug(@Args('slug') slug: string): Promise<BoardView> {
    const board = await this.boardService.findBySlug(slug);
    return BoardViewMapper.toView(board);
  }

  @ResolveField(() => BoardView, {
    nullable: true,
    description: '부모 게시판',
  })
  async parentBoard(
    @Parent() board: BoardView,
    @Context() ctx: GraphQLContext,
  ): Promise<BoardView | null> {
    if (!board.parentId) return null;
    const parent = await ctx.loaders.boardLoader.load(board.parentId);
    return parent ? BoardViewMapper.toView(parent) : null;
  }

  @ResolveField(() => [BoardView], {
    description: '하위 게시판 목록',
  })
  async childBoards(
    @Parent() board: BoardView,
    @Context() ctx: GraphQLContext,
  ): Promise<BoardView[]> {
    const children = await ctx.loaders.childBoardsLoader.load(board.id);
    return children.map(BoardViewMapper.toView);
  }

  @ResolveField(() => Int, {
    description: '게시글 수',
  })
  async postCount(
    @Parent() board: BoardView,
    @Context() ctx: GraphQLContext,
  ): Promise<number> {
    return ctx.loaders.postCountLoader.load(board.id);
  }
}
