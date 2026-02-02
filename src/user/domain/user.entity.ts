import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class User {
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

  @Field()
  updatedAt: Date;

  // DB에는 있지만 GraphQL에는 노출하지 않는 필드
  // password: string;
  // isDeleted: boolean;
  // deletedAt: Date | null;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: '사용자 권한',
});
