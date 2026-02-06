import { UseGuards } from '@nestjs/common';
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
import { GqlAuthGuard } from '../../auth/guard/gql-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { CurrentUser } from '../../auth/strategy/jwt.strategy';
import { Board } from '../../board/domain/board.entity';
import { GqlError } from '../../common/exception/gql-error.helper';
import { GraphQLContext } from '../../common/type/context.type';
import { User } from '../../user/domain/user.entity';
import { PostService } from '../application/post.service';
import { Post } from '../domain/post.entity';
import {
  CreatePostInput,
  PostFilterInput,
  UpdatePostInput,
} from './dto/post.input';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

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
    description: '게시글 상세 조회 (조회수 증가)',
    nullable: false,
  })
  async post(@Args('id', { type: () => Int }) id: number): Promise<Post> {
    return this.postService.findByIdWithViewIncrement(id);
  }

  @Query(() => [Post], {
    name: 'allPosts',
    description: '전체글 게시판',
  })
  async allPosts(
    @Args('take', { type: () => Int, defaultValue: 20 }) take: number,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
  ): Promise<Post[]> {
    return this.postService.findMany({ take, skip });
  }

  @Query(() => [Post], {
    name: 'bestPosts',
    description: 'BEST 게시판 (조회수 10+ 기준)',
  })
  async bestPosts(
    @Args('minViewCount', { type: () => Int, defaultValue: 10 })
    minViewCount: number = 10,

    @Args('take', { type: () => Int, defaultValue: 20 })
    take: number = 20,
  ): Promise<Post[]> {
    return this.postService.findMany({
      minViewCount,
      take,
    });
  }

  @Mutation(() => Post, {
    name: 'createPost',
    description: '게시글 작성',
  })
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args('input') input: CreatePostInput,
    @CurrentUser() user: User,
  ): Promise<Post> {
    const authorId = user.id;

    return this.postService.create({
      ...input,
      authorId,
    });
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args('input') input: UpdatePostInput,
    @CurrentUser() user: User,
  ): Promise<Post> {
    const post = await this.postService.findById(input.id);

    if (post.authorId !== user.id) {
      throw GqlError.forbidden('본인이 작성한 게시글만 수정할 수 있습니다.');
    }

    return this.postService.update(input.id, input);
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async deletePost(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ): Promise<Post> {
    const post = await this.postService.findById(id);

    if (post.authorId !== user.id) {
      throw GqlError.forbidden('본인이 작성한 게시글만 삭제할 수 있습니다.');
    }

    return this.postService.delete(id);
  }

  @ResolveField(() => User, {
    nullable: true,
    description: '작성자 (탈퇴 시 null)',
  })
  async author(
    @Parent() post: Post,
    @Context() ctx: GraphQLContext,
  ): Promise<User | null> {
    if (!post.authorId) return null;

    if (ctx.loaders?.userLoader) {
      return ctx.loaders.userLoader.load(post.authorId);
    }

    return null;
  }

  @ResolveField(() => Board, {
    name: 'board',
    description: '게시판',
  })
  async board(
    @Parent() post: Post,
    @Context() ctx: GraphQLContext,
  ): Promise<Board | null> {
    if (ctx.loaders?.boardLoader) {
      return ctx.loaders.boardLoader.load(post.boardId);
    }

    return null;
  }

  @ResolveField(() => Int, {
    description: '댓글 수 (향후 구현)',
  })
  async commentCount(@Parent() post: Post): Promise<number> {
    // TODO: Comment 모듈 구현 후 추가
    return 0;
  }
}
