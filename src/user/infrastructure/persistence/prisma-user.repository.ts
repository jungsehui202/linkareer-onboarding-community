import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserMapper } from './user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<User> {
    if (user.id === 0) {
      const created = await this.prisma.user.create({
        data: UserMapper.toCreateInput(user),
      });
      return UserMapper.toDomain(created);
    }

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: UserMapper.toUpdateInput(user),
    });
    return UserMapper.toDomain(updated);
  }

  async findById(id: number): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record ? UserMapper.toDomain(record) : null;
  }

  async findByIds(ids: number[]): Promise<User[]> {
    if (ids.length === 0) return [];
    const records = await this.prisma.user.findMany({
      where: { id: { in: ids }, isDeleted: false },
    });
    return records.map(UserMapper.toDomain);
  }

  async findActiveByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findFirst({
      where: { email, isDeleted: false },
    });
    return record ? UserMapper.toDomain(record) : null;
  }

  async findAllActive(): Promise<User[]> {
    const records = await this.prisma.user.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(UserMapper.toDomain);
  }

  async existsActiveByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email, isDeleted: false },
    });
    return count > 0;
  }
}
