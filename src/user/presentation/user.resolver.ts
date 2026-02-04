import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../application/user.service';
import { User } from '../domain/user.entity';
import { CreateUserInput, LoginInput, UpdateUserInput } from './dto/user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User, {
    name: 'createUser',
    description: '회원가입',
  })
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return this.userService.createUser(input);
  }

  @Mutation(() => User, {
    name: 'updateUser',
    description: '사용자 정보 수정',
  })
  async updateUser(@Args('input') input: UpdateUserInput): Promise<User> {
    return this.userService.updateUser(input.id, input);
  }

  @Mutation(() => User, {
    name: 'login',
    description: '로그인',
  })
  async login(@Args('input') input: LoginInput): Promise<User> {
    return this.userService.login(input);
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
    name: 'user',
    description: '사용자 단건 조회',
    nullable: false, // Non-nullable: 데이터 없으면 NotFoundException
  })
  async user(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.findById(id);
  }
}
