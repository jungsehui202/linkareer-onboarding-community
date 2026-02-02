import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { UserRole } from '../../domain/user.entity';

@ObjectType()
export class UserResponse {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  createdAt: Date;

  static from(user: User): UserResponse {
    const response = new UserResponse();
    response.id = user.id;
    response.email = user.email;
    response.name = user.name;
    response.role = user.role as UserRole;
    response.createdAt = user.createdAt;
    return response;
  }

  static fromUsers(users: User[]): UserResponse[] {
    return users.map((user) => UserResponse.from(user));
  }
}
