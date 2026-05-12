import { registerEnumType } from '@nestjs/graphql';
import { UserRole } from '../../../domain/value-objects/user-role.vo';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: '사용자 권한',
});

export { UserRole };
