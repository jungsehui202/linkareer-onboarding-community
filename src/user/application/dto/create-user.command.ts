import { UserRole } from '../../domain/value-objects/user-role.vo';

export interface CreateUserCommand {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}
