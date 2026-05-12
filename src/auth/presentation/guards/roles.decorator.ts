import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../user/domain/value-objects/user-role.vo';

export const ROLES_METADATA_KEY = 'roles';

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_METADATA_KEY, roles);
