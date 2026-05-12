import { User } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  save(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByIds(ids: number[]): Promise<User[]>;
  findActiveByEmail(email: string): Promise<User | null>;
  findAllActive(): Promise<User[]>;
  existsActiveByEmail(email: string): Promise<boolean>;
}
