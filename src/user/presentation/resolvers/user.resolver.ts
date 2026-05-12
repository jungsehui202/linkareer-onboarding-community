import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../../../auth/application/services/auth.service';
import { GqlAuthGuard } from '../../../auth/presentation/guards/gql-auth.guard';
import { Roles } from '../../../auth/presentation/guards/roles.decorator';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/value-objects/user-role.vo';
import { UserService } from '../../application/services/user.service';
import { CreateUserInput } from '../graphql/inputs/create-user.input';
import { LoginInput } from '../graphql/inputs/login.input';
import { UpdateUserInput } from '../graphql/inputs/update-user.input';
import { UserViewMapper } from '../graphql/mappers/user.view-mapper';
import { LoginPayloadView } from '../graphql/types/login-payload.type';
import { UserView } from '../graphql/types/user.type';

@Resolver(() => UserView)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => UserView, { name: 'createUser', description: '회원가입' })
  async createUser(@Args('input') input: CreateUserInput): Promise<UserView> {
    const user = await this.userService.createUser({
      email: input.email,
      password: input.password,
      name: input.name,
      role: input.userRole,
    });
    return UserViewMapper.toView(user);
  }

  @Mutation(() => UserView)
  @UseGuards(GqlAuthGuard)
  async updateMe(
    @Args('input') input: UpdateUserInput,
    @CurrentUser() user: User,
  ): Promise<UserView> {
    const updated = await this.userService.updateUser(user.id, {
      name: input.name,
    });
    return UserViewMapper.toView(updated);
  }

  @Mutation(() => LoginPayloadView)
  async login(@Args('input') input: LoginInput): Promise<LoginPayloadView> {
    const user = await this.userService.login({
      email: input.email,
      password: input.password,
    });

    const payload = new LoginPayloadView();
    payload.user = UserViewMapper.toView(user);
    payload.accessToken = this.authService.issueAccessToken(user);
    payload.refreshToken = this.authService.issueRefreshToken(user);
    return payload;
  }

  @Mutation(() => UserView, {
    name: 'deleteUser',
    description: '회원 탈퇴 (Soft Delete)',
  })
  async deleteUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<UserView> {
    const user = await this.userService.deleteUser(id);
    return UserViewMapper.toView(user);
  }

  @Query(() => [UserView])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async users(): Promise<UserView[]> {
    const users = await this.userService.findAllActive();
    return users.map(UserViewMapper.toView);
  }

  @Query(() => UserView)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User): Promise<UserView> {
    return UserViewMapper.toView(user);
  }

  @Query(() => UserView, {
    name: 'user',
    description: '사용자 단건 조회',
    nullable: false,
  })
  async user(@Args('id', { type: () => Int }) id: number): Promise<UserView> {
    const user = await this.userService.findById(id);
    return UserViewMapper.toView(user);
  }
}
