import {
  Board as PrismaBoard,
  UserRole as PrismaUserRole,
} from '@prisma/client';
import { UserRole } from '../../../user/domain/value-objects/user-role.vo';
import { Board } from '../../domain/entities/board.entity';

export class BoardMapper {
  static toDomain(record: PrismaBoard): Board {
    return Board.rehydrate({
      id: record.id,
      name: record.name,
      slug: record.slug,
      description: record.description,
      parentId: record.parentId,
      requiredRole: BoardMapper.toDomainRole(record.requiredRole),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistenceRole(role: UserRole): PrismaUserRole {
    return role === UserRole.ADMIN ? 'ADMIN' : ('USER' as PrismaUserRole);
  }

  private static toDomainRole(role: PrismaUserRole): UserRole {
    return role === 'ADMIN' ? UserRole.ADMIN : UserRole.USER;
  }
}
