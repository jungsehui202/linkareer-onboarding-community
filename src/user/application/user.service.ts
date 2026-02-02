import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAllActiveUsers(): Promise<User[]> {
    const allActiveUsers = this.userRepository.findAllActive();
    return allActiveUsers; // raw 객체 그대로 반환
  }

  async findUserById(id: number): Promise<User> {
    const user = this.userRepository.getById(id);
    return user; // raw 객체 반환
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = this.userRepository.findByEmail(email);
    return user;
  }
}
