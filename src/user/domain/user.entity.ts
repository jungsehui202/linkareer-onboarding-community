import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User as PrismaUser, UserRole } from '@prisma/client';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: '사용자 권한',
});

export { UserRole };

@ObjectType()
export class User implements PrismaUser {
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

  // Prisma 필드 (GraphQL에 노출하지 않음)
  password: string;
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
