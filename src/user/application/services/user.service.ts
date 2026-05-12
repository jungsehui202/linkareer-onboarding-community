import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import {
  DuplicateUserEmailException,
  InvalidCredentialsException,
  UserNotFoundException,
} from '../../domain/exceptions/user.exceptions';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/repositories/user.repository';
import { Email } from '../../domain/value-objects/email.vo';
import { HashedPassword } from '../../domain/value-objects/hashed-password.vo';
import { CreateUserCommand } from '../dto/create-user.command';
import { LoginCommand } from '../dto/login.command';
import { UpdateUserCommand } from '../dto/update-user.command';
import { PASSWORD_HASHER, PasswordHasher } from '../ports/password-hasher.port';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async createUser(command: CreateUserCommand): Promise<User> {
    const email = Email.of(command.email);

    if (await this.userRepository.existsActiveByEmail(email.value)) {
      throw new DuplicateUserEmailException(email.value);
    }

    const hashed = HashedPassword.fromHash(
      await this.passwordHasher.hash(command.password),
    );

    const user = User.create({
      email,
      name: command.name,
      role: command.role,
      hashedPassword: hashed,
    });

    return this.userRepository.save(user);
  }

  async updateUser(id: number, command: UpdateUserCommand): Promise<User> {
    const user = await this.requireById(id);

    if (command.name !== undefined) {
      user.rename(command.name);
    }

    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.requireById(id);
    user.softDelete();
    return this.userRepository.save(user);
  }

  async login(command: LoginCommand): Promise<User> {
    const email = Email.of(command.email);
    const user = await this.userRepository.findActiveByEmail(email.value);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const matches = await this.passwordHasher.compare(
      command.password,
      user.hashedPassword,
    );

    if (!matches) {
      throw new InvalidCredentialsException();
    }

    return user;
  }

  async findById(id: number): Promise<User> {
    return this.requireById(id);
  }

  async findAllActive(): Promise<User[]> {
    return this.userRepository.findAllActive();
  }

  async findManyByIds(ids: number[]): Promise<User[]> {
    return this.userRepository.findByIds(ids);
  }

  private async requireById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user || user.isDeleted) {
      throw new UserNotFoundException(id);
    }
    return user;
  }
}
