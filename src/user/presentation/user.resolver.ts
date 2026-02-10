import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../../auth/application/auth.service';
import { GqlAuthGuard } from '../../auth/guard/gql-auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { CurrentUser } from '../../auth/strategy/jwt.strategy';
import { UserService } from '../application/user.service';
import { User } from '../domain/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserInput, LoginInput, UpdateUserInput } from './dto/user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

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
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.userService.updateUser(user.id, input);
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

  // @Query(() => [User], {
  //   name: 'users',
  //   description: '활성 사용자 목록',
  // })
  // async users(): Promise<User[]> {
  //   return this.userService.findAllActive();
  // }

  // user.resolver.ts
  @Query(() => [User])
  @UseGuards(GqlAuthGuard, RolesGuard) // 어드민만 가능하게 설정되어 있다면
  async users(): Promise<User[]> {
    return this.userService.findAllActive();
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: { id: number }) {
    return this.userService.findById(user.id);
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
