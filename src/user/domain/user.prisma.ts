import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  UserEmailNotFoundException,
  UserNotFoundException,
} from '../exception/user.exception';
import { UserEntity } from './user.entity';

@Injectable()
export class UserPrisma {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<UserEntity> {
    const user = await this.prisma.user.create({ data });
    return UserEntity.fromPrisma(user);
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    return UserEntity.fromPrisma(user);
  }

  async findAllActive(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
    return users.map((user) => UserEntity.fromPrisma(user));
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UserNotFoundException(id);
    }

    return UserEntity.fromPrisma(user);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UserEmailNotFoundException(email);
    }

    return UserEntity.fromPrisma(user);
  }
}
