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
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../auth/presentation/guards/gql-auth.guard';
import { BoardViewMapper } from '../../../board/presentation/graphql/mappers/board.view-mapper';
import { BoardView } from '../../../board/presentation/graphql/types/board.type';
import { GraphQLContext } from '../../../common/graphql/context/graphqh-context.interface';
import { User } from '../../../user/domain/entities/user.entity';
import { UserViewMapper } from '../../../user/presentation/graphql/mappers/user.view-mapper';
import { UserView } from '../../../user/presentation/graphql/types/user.type';
import { PostService } from '../../application/services/post.service';
import { CreatePostInput } from '../graphql/inputs/create-post.input';
import { PostFilterInput } from '../graphql/inputs/post-filter.input';
import { UpdatePostInput } from '../graphql/inputs/update-post.input';
import { PostViewMapper } from '../graphql/mappers/post.view-mapper';
import { PostView } from '../graphql/types/post.type';

@Resolver(() => PostView)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [PostView], {
    name: 'posts',
    description: '게시글 목록 (필터링 + 페이지네이션)',
  })
  async posts(
    @Args('filter', { nullable: true }) filter?: PostFilterInput,
  ): Promise<PostView[]> {
    const posts = await this.postService.findMany(filter);
    return posts.map((p) => PostViewMapper.toView(p));
  }

  @Query(() => PostView, {
    name: 'post',
    description: '게시글 상세 조회 (조회수 증가)',
    nullable: false,
  })
  async post(@Args('id', { type: () => Int }) id: number): Promise<PostView> {
    const post = await this.postService.viewById(id);
    return PostViewMapper.toView(post);
  }

  @Query(() => [PostView], {
    name: 'allPosts',
    description: '전체글 게시판',
  })
  async allPosts(
    @Args('take', { type: () => Int, defaultValue: 20 }) take: number,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
  ): Promise<PostView[]> {
    const posts = await this.postService.findMany({ take, skip });
    return posts.map((p) => PostViewMapper.toView(p));
  }

  @Query(() => [PostView], {
    name: 'searchPostsWithSearchCountsIncrement',
    description: '게시글 검색 (Full-Text Search + 검색 통계)',
  })
  async searchPostsWithSearchCountsIncrement(
    @Args('keyword') keyword: string,
    @Args('take', { type: () => Int, defaultValue: 20 }) take: number = 20,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number = 0,
  ): Promise<PostView[]> {
    const hits = await this.postService.searchWithStats(keyword, take, skip);
    return hits.map((h) => PostViewMapper.fromSearchHit(h));
  }

  @Query(() => [PostView], {
    name: 'bestPosts',
    description: 'BEST 게시판 (인기 점수 기준)',
  })
  async bestPosts(
    @Args('take', { type: () => Int, defaultValue: 20 }) take: number = 20,
  ): Promise<PostView[]> {
    const posts = await this.postService.findBest(take);
    return posts.map((p) => PostViewMapper.toView(p));
  }

  @Mutation(() => PostView, {
    name: 'createPost',
    description: '게시글 작성',
  })
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args('input') input: CreatePostInput,
    @CurrentUser() user: User,
  ): Promise<PostView> {
    const post = await this.postService.create({
      title: input.title,
      content: input.content,
      boardId: input.boardId,
      authorId: user.id,
    });
    return PostViewMapper.toView(post);
  }

  @Mutation(() => PostView)
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args('input') input: UpdatePostInput,
    @CurrentUser() user: User,
  ): Promise<PostView> {
    const post = await this.postService.update({
      id: input.id,
      actorId: user.id,
      isActorAdmin: user.isAdmin(),
      title: input.title,
      content: input.content,
      boardId: input.boardId,
    });
    return PostViewMapper.toView(post);
  }

  @Mutation(() => PostView)
  @UseGuards(GqlAuthGuard)
  async deletePost(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ): Promise<PostView> {
    const post = await this.postService.delete({
      id,
      actorId: user.id,
      isActorAdmin: user.isAdmin(),
    });
    return PostViewMapper.toView(post);
  }

  @ResolveField(() => UserView, {
    nullable: true,
    description: '작성자 (탈퇴 시 null)',
  })
  async author(
    @Parent() post: PostView,
    @Context() ctx: GraphQLContext,
  ): Promise<UserView | null> {
    if (!post.authorId) return null;
    const user = await ctx.loaders.userLoader.load(post.authorId);
    return user ? UserViewMapper.toView(user) : null;
  }

  @ResolveField(() => BoardView, {
    name: 'board',
    description: '게시판',
  })
  async board(
    @Parent() post: PostView,
    @Context() ctx: GraphQLContext,
  ): Promise<BoardView | null> {
    const board = await ctx.loaders.boardLoader.load(post.boardId);
    return board ? BoardViewMapper.toView(board) : null;
  }

  @ResolveField(() => Int, {
    description: '댓글 수 (향후 구현)',
  })
  async commentCount(@Parent() _post: PostView): Promise<number> {
    return 0;
  }
}
