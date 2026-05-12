export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class UserRolePolicy {
  static readonly ALL: ReadonlyArray<UserRole> = [
    UserRole.USER,
    UserRole.ADMIN,
  ];

  static isAdmin(role: UserRole): boolean {
    return role === UserRole.ADMIN;
  }

  static allowedRoles(role: UserRole): UserRole[] {
    if (UserRolePolicy.isAdmin(role)) {
      return [UserRole.USER, UserRole.ADMIN];
    }
    return [UserRole.USER];
  }

  static assertValid(value: string): UserRole {
    if (!Object.values(UserRole).includes(value as UserRole)) {
      throw new Error(`Invalid UserRole: ${value}`);
    }
    return value as UserRole;
  }
}
