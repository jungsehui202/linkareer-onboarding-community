import { User as PrismaUser, UserRole as PrismaUserRole } from '@prisma/client';
import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/value-objects/user-role.vo';

export class UserMapper {
  static toDomain(record: PrismaUser): User {
    return User.rehydrate({
      id: record.id,
      email: record.email,
      name: record.name,
      role: UserMapper.toDomainRole(record.userRole),
      hashedPassword: record.password,
      refreshToken: record.refreshToken,
      subscribeEmail: record.subscribeEmail,
      subscribeSMS: record.subscribeSMS,
      isDeleted: record.isDeleted,
      deletedAt: record.deletedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toCreateInput(user: User) {
    const s = user.toSnapshot();
    return {
      email: s.email,
      password: s.hashedPassword,
      name: s.name,
      userRole: UserMapper.toPersistenceRole(s.role),
      refreshToken: s.refreshToken ?? undefined,
      subscribeEmail: s.subscribeEmail,
      subscribeSMS: s.subscribeSMS,
      isDeleted: s.isDeleted,
      deletedAt: s.deletedAt,
    };
  }

  static toUpdateInput(user: User) {
    const s = user.toSnapshot();
    return {
      email: s.email,
      password: s.hashedPassword,
      name: s.name,
      userRole: UserMapper.toPersistenceRole(s.role),
      refreshToken: s.refreshToken,
      subscribeEmail: s.subscribeEmail,
      subscribeSMS: s.subscribeSMS,
      isDeleted: s.isDeleted,
      deletedAt: s.deletedAt,
    };
  }

  private static toDomainRole(role: PrismaUserRole): UserRole {
    return role === 'ADMIN' ? UserRole.ADMIN : UserRole.USER;
  }

  static toPersistenceRole(role: UserRole): PrismaUserRole {
    return role === UserRole.ADMIN ? 'ADMIN' : ('USER' as PrismaUserRole);
  }
}
