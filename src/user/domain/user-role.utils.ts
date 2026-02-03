import { registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

export { UserRole };

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

registerEnumType(UserRole, {
  name: 'UserRole',
  description: '사용자 권한',
});
