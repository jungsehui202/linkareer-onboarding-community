import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from './application/user.service';
import { UserResolver } from './presentation/user.resolver';

@Module({
  imports: [PrismaModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
