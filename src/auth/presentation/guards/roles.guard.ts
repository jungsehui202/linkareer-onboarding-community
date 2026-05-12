import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlError } from '../../../common/exception/gql-error.helper';
import { User } from '../../../user/domain/entities/user.entity';
import { UserRole } from '../../../user/domain/value-objects/user-role.vo';
import { ROLES_METADATA_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_METADATA_KEY,
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user as User | undefined;

    if (!user) {
      throw GqlError.unauthorized('Authentication required');
    }

    if (!requiredRoles.includes(user.role)) {
      throw GqlError.forbidden('Insufficient permissions');
    }

    return true;
  }
}
