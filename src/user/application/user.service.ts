import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
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
        isDeleted: false, // 활성 사용자만 체크
      },
    });

    if (existingActive) {
      throw GqlError.conflict('Email already exists', {
        email: input.email,
      });
    }

    // 비밀번호 해싱
    const hashedPassword = this.hashPassword(input.password);

    // 탈퇴한 사용자가 재가입하는 경우
    const deletedUser = await this.prisma.user.findFirst({
      where: {
        email: input.email,
        isDeleted: true,
      },
    });

    if (deletedUser) {
      // 옵션 1: 기존 데이터 복구 (비권장 - GDPR 위반 가능)
      // return this.prisma.user.update({
      //   where: { id: deletedUser.id },
      //   data: {
      //     isDeleted: false,
      //     deletedAt: null,
      //     password: hashedPassword,
      //     name: input.name,
      //   },
      // });
      // 옵션 2: 신규 계정 생성 (권장)
      // → Partial Index로 email 유니크 제약이 활성 사용자만 적용되므로 정상 동작
    }

    // 4. 신규 가입
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
    // 이메일로 사용자 조회
    const user = await this.findByEmail(input.email);

    // 비밀번호 검증
    const hashedPassword = this.hashPassword(input.password);
    if (user.password !== hashedPassword) {
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

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }
}
