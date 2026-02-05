import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Board } from '../../board/domain/board.entity';
import { GraphQLContext } from '../../common/type/context.type';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '../../user/domain/user.entity';
import { PostService } from '../application/post.service';
import { Post } from '../domain/post.entity';
import {
  CreatePostInput,
  PostFilterInput,
  UpdatePostInput,
} from './dto/post.input';
import { GqlAuthGuard } from '../../auth/guard/gql-auth.guard';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private postService: PostService,
    private prisma: PrismaService,
  ) {}

  @Query(() => [Post], {
    name: 'posts',
    description: '게시글 목록 (필터링 + 페이지네이션)',
  })
  async posts(
    @Args('filter', { nullable: true }) filter?: PostFilterInput,
  ): Promise<Post[]> {
    return this.postService.findMany(filter);
  }

  @Query(() => Post, {
    name: 'post',
    description: '게시글 상세 조회 (조회수 자동 증가)',
    nullable: false,
  })
  async post(@Args('id', { type: () => Int }) id: number): Promise<Post> {
    return this.postService.findById(id);
  }

  // JWT 반영 안 된 메서드
  // @Mutation(() => Post, {
  //   name: 'createPost',
  //   description: '게시글 작성',
  // })
  // async createPost(@Args('input') input: CreatePostInput): Promise<Post> {
  //   return this.postService.create(input);
  // }

  @Mutation(() => Post, {
    name: 'createPost',
    description: '게시글 작성',
  })
  @UseGuards(GqlAuthGuard) // ← JWT 검증
  async createPost(
    @Args('input') input: CreatePostInput,
    @Context() ctx: GraphQLContext,
  ): Promise<Post> {
    const authorId = ctx.user!.id;

    // Service에 authorId 전달
    return this.postService.create({
      ...input,
      authorId, // ← Context에서 가져온 값
    });
  }

  @Mutation(() => Post, {
    name: 'updatePost',
    description: '게시글 수정',
  })
  async updatePost(@Args('input') input: UpdatePostInput): Promise<Post> {
    return this.postService.update(input.id, input);
  }

  @Mutation(() => Post, {
    name: 'deletePost',
    description: '게시글 삭제',
  })
  async deletePost(@Args('id', { type: () => Int }) id: number): Promise<Post> {
    return this.postService.delete(id);
  }

  // 데이터로더 반영 안 된 메서드
  // @ResolveField(() => User, {
  //   nullable: true,
  //   description: '작성자 (탈퇴 시 null)',
  // })
  // async author(@Parent() post: Post): Promise<User | null> {
  //   if (!post.authorId) return null;

  //   return this.prisma.user.findUnique({
  //     where: { id: post.authorId },
  //   });
  // }

  @ResolveField(() => User, {
    nullable: true,
    description: '작성자 (DataLoader 적용: N+1 해결)',
  })
  async author(
    @Parent() post: Post,
    @Context() ctx: GraphQLContext,
  ): Promise<User | null> {
    console.log('Context check:', ctx);
    console.log('Loaders check:', ctx?.loaders);

    if (!ctx.loaders) {
      console.error('Loader가 Context에 주입되지 않았습니다 !!');
      return null;
    }

    if (!post.authorId) {
      return null;
    }

    return ctx.loaders.userLoader.load(post.authorId);
  }

  // 데이터로더 반영 안 된 메서드
  // @ResolveField(() => Board, {
  //   description: '게시판',
  // })
  // async board(@Parent() post: Post): Promise<Board> {
  //   return this.prisma.board.findUniqueOrThrow({
  //     where: { id: post.boardId },
  //   });
  // }

  @ResolveField(() => Board, {
    description: '게시판 (DataLoader 적용)',
  })
  async board(
    @Parent() post: Post,
    @Context() ctx: GraphQLContext,
  ): Promise<Board | null> {
    return ctx.loaders.boardLoader.load(post.boardId);
  }

  @ResolveField(() => Boolean, {
    description: '현재 사용자가 스크랩했는지 여부',
  })
  async isScrapped(@Parent() post: Post): Promise<boolean> {
    // TODO: JWT에서 현재 사용자 ID 추출
    const currentUserId = 1;

    const scrap = await this.prisma.scrap.findUnique({
      where: {
        userId_postId: {
          userId: currentUserId,
          postId: post.id,
        },
      },
    });

    return !!scrap;
  }

  @ResolveField(() => Int, {
    description: '댓글 수 (향후 구현)',
  })
  async commentCount(@Parent() post: Post): Promise<number> {
    // TODO: Comment 모듈 구현 후 추가
    return 0;
  }
}
function UseGuards(GqlAuthGuard: any): (target: PostResolver, propertyKey: "createPost", descriptor: TypedPropertyDescriptor<(input: CreatePostInput, ctx: GraphQLContext) => Promise<Post>>) => void | TypedPropertyDescriptor<...> {
  throw new Error('Function not implemented.');
}

function Context(): (target: PostResolver, propertyKey: "createPost", parameterIndex: 1) => void {
  throw new Error('Function not implemented.');
}

