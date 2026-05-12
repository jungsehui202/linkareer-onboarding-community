import { UserRole } from '../../../user/domain/value-objects/user-role.vo';
import { Board } from '../entities/board.entity';

export const BOARD_REPOSITORY = Symbol('BOARD_REPOSITORY');

export interface BoardQuery {
  requiredRoles?: UserRole[];
  parentId?: number | null;
  slug?: string;
  searchKeyword?: string;
}

export interface BoardRepository {
  findMany(query?: BoardQuery): Promise<Board[]>;
  findById(id: number): Promise<Board | null>;
  findByIds(ids: number[]): Promise<Board[]>;
  findBySlug(slug: string): Promise<Board | null>;
  findChildrenOf(parentId: number): Promise<Board[]>;
  findChildrenOfMany(parentIds: number[]): Promise<Map<number, Board[]>>;
}
