import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../application/user.service';
import { UserResponse } from './response/user-response.dto';
import { User } from '@prisma/client';

@Resolver(() => UserResponse)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserResponse], {
    name: 'users',
    description: '활성 사용자 목록',
  })
  async findAll(): Promise<UserResponse[]> {
    const users: User[] = await this.userService.findAllActiveUsers();
    const allActiveUsers = UserResponse.fromUsers(users);
    return allActiveUsers;
  }

  @Query(() => UserResponse, {
    name: 'user',
    description: '사용자 상세 조회',
    nullable: true,
  })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<UserResponse> {
    const user: User = await this.userService.findUserById(id);
    const userResponse = UserResponse.from(user);
    return userResponse;
  }
}
