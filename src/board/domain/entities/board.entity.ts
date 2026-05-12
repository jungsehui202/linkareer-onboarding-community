import {
  UserRole,
  UserRolePolicy,
} from '../../../user/domain/value-objects/user-role.vo';

export interface BoardSnapshot {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parentId: number | null;
  requiredRole: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class Board {
  private constructor(
    public readonly id: number,
    private _name: string,
    private _slug: string,
    private _description: string | null,
    private _parentId: number | null,
    private _requiredRole: UserRole,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static rehydrate(snapshot: BoardSnapshot): Board {
    return new Board(
      snapshot.id,
      snapshot.name,
      snapshot.slug,
      snapshot.description,
      snapshot.parentId,
      snapshot.requiredRole,
      snapshot.createdAt,
      snapshot.updatedAt,
    );
  }

  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug;
  }

  get description(): string | null {
    return this._description;
  }

  get parentId(): number | null {
    return this._parentId;
  }

  get requiredRole(): UserRole {
    return this._requiredRole;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isAccessibleBy(role: UserRole): boolean {
    return UserRolePolicy.allowedRoles(role).includes(this._requiredRole);
  }

  toSnapshot(): BoardSnapshot {
    return {
      id: this.id,
      name: this._name,
      slug: this._slug,
      description: this._description,
      parentId: this._parentId,
      requiredRole: this._requiredRole,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
