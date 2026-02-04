import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { BoardService } from '../application/board.service';
import { Board } from '../domain/board.entity';
import { BoardFilterInput } from './dto/board.input';

@Resolver(() => Board)
export class BoardResolver {
  constructor(
    private boardService: BoardService,
    private prisma: PrismaService,
  ) {}

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
    nullable: false, // 데이터 없으면 NotFoundException
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
  async parentBoard(@Parent() board: Board): Promise<Board | null> {
    if (!board.parentId) return null;

    return this.prisma.board.findUnique({
      where: { id: board.parentId },
    });
  }

  @ResolveField(() => [Board], {
    description: '하위 게시판 목록',
  })
  async childBoards(@Parent() board: Board): Promise<Board[]> {
    return this.prisma.board.findMany({
      where: { parentId: board.id },
      orderBy: { id: 'asc' },
    });
  }

  @ResolveField(() => Int, {
    description: '게시글 수',
  })
  async postCount(@Parent() board: Board): Promise<number> {
    return this.prisma.post.count({
      where: { boardId: board.id },
    });
  }
}
