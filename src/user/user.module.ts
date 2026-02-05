import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from './application/user.service';
import { UserPrisma } from './domain/user.prisma';
import { UserResolver } from './presentation/user.resolver';

@Module({
  imports: [PrismaModule],
  providers: [UserPrisma, UserService, UserResolver],
  exports: [UserService, UserPrisma],
})
export class UserModule {}
