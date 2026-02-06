import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GqlError } from '../../common/exception/gql-error.helper';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '../domain/user.entity';
import {
  CreateUserInput,
  LoginInput,
  UpdateUserInput,
} from '../presentation/dto/user.input';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(input: CreateUserInput): Promise<User> {
    // 활성 사용자 중 이메일 중복 체크
    const existingActive = await this.prisma.user.findFirst({
      where: {
        email: input.email,
        isDeleted: false,
      },
    });

    if (existingActive) {
      throw GqlError.conflict('Email already exists', {
        email: input.email,
      });
    }

    const hashedPassword = await this.hashPassword(input.password);

    return this.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.name,
        userRole: input.userRole,
      },
    });
  }

  async updateUser(id: number, input: UpdateUserInput): Promise<User> {
    // 존재 여부 확인
    await this.findById(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        name: input.name,
      },
    });
  }

  async findAllActive(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { email, isDeleted: false },
    });

    if (!user) {
      throw GqlError.notFound('User not found', {
        email: email,
      });
    }

    return user;
  }

  async login(input: LoginInput): Promise<User> {
    const user = await this.findByEmail(input.email);

    const isMatch = await bcrypt.compare(input.password, user.password);

    if (!isMatch) {
      throw GqlError.unauthorized('Invalid email or password');
    }

    return user;
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.findById(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
