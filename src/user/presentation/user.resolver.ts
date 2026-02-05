import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../application/user.service';
import { UserEntity } from '../domain/user.entity';
import {
  CreateUserRequest,
  UpdateUserRequest,
} from './request/user-request.dto';
import { UserResponse } from './response/user-response.dto';

@Resolver(() => UserResponse)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserResponse, {
    name: 'createUser',
    description: '사용자 생성',
  })
  async createUser(
    @Args('input') request: CreateUserRequest,
  ): Promise<UserResponse> {
    const user: UserEntity = await this.userService.createUser(request);
    const userResponse = UserResponse.from(user);
    return userResponse;
  }

  @Mutation(() => UserResponse, {
    name: 'updateUser',
    description: '사용자 수정',
  })
  async updateUser(
    @Args('input') request: UpdateUserRequest,
  ): Promise<UserResponse> {
    const user: UserEntity = await this.userService.updateUser(
      request.id,
      request,
    );
    const userResponse = UserResponse.from(user);
    return userResponse;
  }

  @Query(() => [UserResponse], {
    name: 'users',
    description: '활성 사용자 목록',
  })
  async findAll(): Promise<UserResponse[]> {
    const users: UserEntity[] = await this.userService.findAllActiveUsers();
    const userResponses = UserResponse.fromList(users);
    return userResponses;
  }

  @Query(() => UserResponse, {
    name: 'user',
    description: '사용자 상세 조회',
  })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<UserResponse> {
    const user: UserEntity = await this.userService.findUserById(id);
    const userResponse = UserResponse.from(user);
    return userResponse;
  }
}
