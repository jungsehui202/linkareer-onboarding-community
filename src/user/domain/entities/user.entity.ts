import { Email } from '../value-objects/email.vo';
import { HashedPassword } from '../value-objects/hashed-password.vo';
import { UserRole, UserRolePolicy } from '../value-objects/user-role.vo';
import { UserAlreadyDeletedException } from '../exceptions/user.exceptions';

export interface UserSnapshot {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  hashedPassword: string;
  refreshToken: string | null;
  subscribeEmail: boolean;
  subscribeSMS: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserParams {
  email: Email;
  name: string;
  role: UserRole;
  hashedPassword: HashedPassword;
}

export class User {
  private constructor(
    public readonly id: number,
    private _email: Email,
    private _name: string,
    private _role: UserRole,
    private _password: HashedPassword,
    private _refreshToken: string | null,
    private _subscribeEmail: boolean,
    private _subscribeSMS: boolean,
    private _isDeleted: boolean,
    private _deletedAt: Date | null,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(params: CreateUserParams): User {
    const now = new Date();
    return new User(
      0,
      params.email,
      params.name,
      params.role,
      params.hashedPassword,
      null,
      false,
      false,
      false,
      null,
      now,
      now,
    );
  }

  static rehydrate(snapshot: UserSnapshot): User {
    return new User(
      snapshot.id,
      Email.of(snapshot.email),
      snapshot.name,
      snapshot.role,
      HashedPassword.fromHash(snapshot.hashedPassword),
      snapshot.refreshToken,
      snapshot.subscribeEmail,
      snapshot.subscribeSMS,
      snapshot.isDeleted,
      snapshot.deletedAt,
      snapshot.createdAt,
      snapshot.updatedAt,
    );
  }

  get email(): string {
    return this._email.value;
  }

  get name(): string {
    return this._name;
  }

  get role(): UserRole {
    return this._role;
  }

  get hashedPassword(): string {
    return this._password.value;
  }

  get refreshToken(): string | null {
    return this._refreshToken;
  }

  get subscribeEmail(): boolean {
    return this._subscribeEmail;
  }

  get subscribeSMS(): boolean {
    return this._subscribeSMS;
  }

  get isDeleted(): boolean {
    return this._isDeleted;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isAdmin(): boolean {
    return UserRolePolicy.isAdmin(this._role);
  }

  rename(newName: string): void {
    const trimmed = newName?.trim();
    if (!trimmed) {
      throw new Error('Name cannot be empty');
    }
    this._name = trimmed;
    this._updatedAt = new Date();
  }

  changePassword(newHash: HashedPassword): void {
    this._password = newHash;
    this._updatedAt = new Date();
  }

  setRefreshToken(token: string | null): void {
    this._refreshToken = token;
    this._updatedAt = new Date();
  }

  softDelete(now: Date = new Date()): void {
    if (this._isDeleted) {
      throw new UserAlreadyDeletedException(this.id);
    }
    this._isDeleted = true;
    this._deletedAt = now;
    this._updatedAt = now;
  }

  toSnapshot(): UserSnapshot {
    return {
      id: this.id,
      email: this._email.value,
      name: this._name,
      role: this._role,
      hashedPassword: this._password.value,
      refreshToken: this._refreshToken,
      subscribeEmail: this._subscribeEmail,
      subscribeSMS: this._subscribeSMS,
      isDeleted: this._isDeleted,
      deletedAt: this._deletedAt,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
