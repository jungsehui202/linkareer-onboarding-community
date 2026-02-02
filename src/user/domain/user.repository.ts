import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAllActive(): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    return users;
  }

  public async getById(id: number): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    return user;
  }

  public async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    return user;
  }

  private async findById(id: number): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    return user;
  }
}
