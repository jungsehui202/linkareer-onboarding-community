import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../application/user.service';
import { User } from '../domain/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserInput, LoginInput, UpdateUserInput } from './dto/user.input';
import { GqlAuthGuard } from '../../auth/guard/gql-auth.guard';

@Resolver(() => User)
export class UserResolver {
  authService: any;
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User, {
    name: 'createUser',
    description: '회원가입',
  })
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.userService.createUser(input);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateMe(
    @Args('input') input: UpdateUserInput,
    @Context() ctx: GraphQLContext,
  ): Promise<User> {
    const currentUserId = ctx.user!.id;
    return this.userService.updateUser(currentUserId, input);
  }

  @Mutation(() => LoginDto)
  async login(@Args('input') input: LoginInput): Promise<LoginDto> {
    const user = await this.userService.login(input);

    const accessToken = this.authService.generateAccessToken(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => User, {
    name: 'deleteUser',
    description: '회원 탈퇴 (Soft Delete)',
  })
  async deleteUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.deleteUser(id);
  }

  @Query(() => [User], {
    name: 'users',
    description: '활성 사용자 목록',
  })
  async users(): Promise<User[]> {
    return this.userService.findAllActive();
  }

  @Query(() => User, {
    name: 'me',
    description: '현재 로그인한 사용자 정보',
  })
  @UseGuards(GqlAuthGuard) // ← JWT 검증
  async me(@Context() ctx: GraphQLContext): Promise<User> {
    return ctx.user!;
  }

  @Query(() => User, {
    name: 'user',
    description: '사용자 단건 조회',
    nullable: false, // Non-nullable: 데이터 없으면 NotFoundException
  })
  async user(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.findById(id);
  }
}
function UseGuards(GqlAuthGuard: any): (target: UserResolver, propertyKey: "me", descriptor: TypedPropertyDescriptor<(ctx: GraphQLContext) => Promise<User>>) => void | TypedPropertyDescriptor<...> {
  throw new Error('Function not implemented.');
}

function Context(): (target: UserResolver, propertyKey: "me", parameterIndex: 0) => void {
  throw new Error('Function not implemented.');
}

