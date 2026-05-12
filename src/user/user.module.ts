import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from './application/services/user.service';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { BcryptPasswordHasher } from './infrastructure/adapters/bcrypt-password-hasher.adapter';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { UserResolver } from './presentation/resolvers/user.resolver';

import './presentation/graphql/types/user-role.type';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  providers: [
    UserService,
    UserResolver,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
  ],
  exports: [UserService, USER_REPOSITORY],
})
export class UserModule {}
