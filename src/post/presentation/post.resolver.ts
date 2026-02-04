import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Board } from '../../board/domain/board.entity';
import { PrismaService } from '../../prisma/prisma.service';
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

  @Mutation(() => Post, {
    name: 'createPost',
    description: '게시글 작성',
  })
  async createPost(@Args('input') input: CreatePostInput): Promise<Post> {
    return this.postService.create(input);
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

  @ResolveField(() => User, {
    nullable: true,
    description: '작성자 (탈퇴 시 null)',
  })
  async author(@Parent() post: Post): Promise<User | null> {
    if (!post.authorId) return null;

    return this.prisma.user.findUnique({
      where: { id: post.authorId },
    });
  }

  @ResolveField(() => Board, {
    description: '게시판',
  })
  async board(@Parent() post: Post): Promise<Board> {
    return this.prisma.board.findUniqueOrThrow({
      where: { id: post.boardId },
    });
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
