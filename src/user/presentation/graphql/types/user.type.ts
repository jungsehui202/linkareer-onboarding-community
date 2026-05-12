import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserRole } from './user-role.type';

@ObjectType('User')
export class UserView {
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

  @Field()
  updatedAt: Date;
}
