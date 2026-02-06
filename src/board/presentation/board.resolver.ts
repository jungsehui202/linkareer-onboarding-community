import {
  Args,
  Context,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLContext } from '../../common/type/context.type';
import { BoardService } from '../application/board.service';
import { Board } from '../domain/board.entity';
import { BoardFilterInput } from './dto/board.input';

@Resolver(() => Board)
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Query(() => [Board], {
    name: 'boards',
    description: '게시판 목록 (필터링)',
  })
  async boards(
    @Args('filter', { nullable: true }) filter?: BoardFilterInput,
  ): Promise<Board[]> {
    return this.boardService.findMany(filter);
  }

  @Query(() => Board, {
    name: 'board',
    description: '게시판 단건 조회 (ID)',
    nullable: false,
  })
  async board(@Args('id', { type: () => Int }) id: number): Promise<Board> {
    return this.boardService.findById(id);
  }

  @Query(() => Board, {
    name: 'boardBySlug',
    description: '게시판 단건 조회 (Slug)',
    nullable: false,
  })
  async boardBySlug(@Args('slug') slug: string): Promise<Board> {
    return this.boardService.findBySlug(slug);
  }

  @ResolveField(() => Board, {
    nullable: true,
    description: '부모 게시판',
  })
  async parentBoard(
    @Parent() board: Board,
    @Context() ctx: GraphQLContext,
  ): Promise<Board | null> {
    if (!board.parentId) return null;

    if (ctx.loaders?.boardLoader) {
      return ctx.loaders.boardLoader.load(board.parentId);
    }

    return this.boardService.findParentBoard(board.parentId);
  }

  @ResolveField(() => [Board], {
    description: '하위 게시판 목록',
  })
  async childBoards(
    @Parent() board: Board,
    @Context() ctx: GraphQLContext,
  ): Promise<Board[]> {
    if (ctx.loaders?.childBoardsLoader) {
      return ctx.loaders.childBoardsLoader.load(board.id);
    }

    return this.boardService.findChildBoards(board.id);
  }

  @ResolveField(() => Int, {
    description: '게시글 수',
  })
  async postCount(
    @Parent() board: Board,
    @Context() ctx: GraphQLContext,
  ): Promise<number> {
    if (ctx.loaders?.postCountLoader) {
      return ctx.loaders.postCountLoader.load(board.id);
    }

    return this.boardService.getPostCount(board.id);
  }
}
