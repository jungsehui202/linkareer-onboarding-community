import { Injectable } from '@nestjs/common';
import { Password } from '../../common/vo/password.vo';
import { UserEntity } from '../domain/user.entity';
import { UserPrisma } from '../domain/user.prisma';
import {
  CreateUserRequest,
  UpdateUserRequest,
} from '../presentation/request/user-request.dto';

@Injectable()
export class UserService {
  constructor(private readonly userPrisma: UserPrisma) {}

  async createUser(request: CreateUserRequest): Promise<UserEntity> {
    const hashedPassword = Password.fromPlainText(request.password).getValue();

    const user = await this.userPrisma.create({
      email: request.email,
      password: hashedPassword,
      name: request.name,
      userRole: request.userRole,
    });

    return user;
  }

  async updateUser(
    id: number,
    request: UpdateUserRequest,
  ): Promise<UserEntity> {
    const user = await this.userPrisma.update(id, {
      name: request.name,
    });

    return user;
  }

  async findAllActiveUsers(): Promise<UserEntity[]> {
    const users = await this.userPrisma.findAllActive();
    return users;
  }

  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.userPrisma.findById(id);
    return user;
  }

  async login(email: string, plainPassword: string): Promise<UserEntity> {
    const user = await this.userPrisma.findByEmail(email);
    user.login(plainPassword);
    return user;
  }
}
