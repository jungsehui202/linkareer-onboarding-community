import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserEntity, UserRole } from '../../domain/user.entity';

@ObjectType()
export class UserResponse {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => UserRole)
  userRole: UserRole;

  @Field()
  createdAt: Date;

  static from(user: UserEntity): UserResponse {
    const response = new UserResponse();
    response.id = user.id;
    response.email = user.email;
    response.name = user.name;
    response.userRole = user.userRole;
    response.createdAt = user.createdAt;
    return response;
  }

  static fromList(users: UserEntity[]): UserResponse[] {
    return users.map((user) => UserResponse.from(user));
  }
}
