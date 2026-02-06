import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: '사용자 권한',
});

export { UserRole };

@ObjectType()
export class User {
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

  // 내부 필드 (GraphQL 미노출)
  password: string;
  refreshToken?: string | null;
  subscribeEmail: boolean;
  subscribeSMS: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
}

export const UserRoleUtils = {
  getAllowedRoles(userRole: UserRole): UserRole[] {
    if (userRole === UserRole.ADMIN) {
      return [UserRole.USER, UserRole.ADMIN];
    }
    return [UserRole.USER];
  },

  isAdmin(role: UserRole): boolean {
    return role === UserRole.ADMIN;
  },
};
