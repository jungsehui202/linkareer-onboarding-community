import { UserRole } from '../../../user/domain/value-objects/user-role.vo';

export interface BoardFilterQuery {
  userRole?: UserRole;
  parentId?: number | null;
  slug?: string;
  searchKeyword?: string;
}
