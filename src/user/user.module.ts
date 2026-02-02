import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from './application/user.service';
import { UserRepository } from './domain/user.repository';
import { UserResolver } from './presentation/user.resolver';

@Module({
  imports: [PrismaModule],
  providers: [
    UserRepository, // Repository 등록
    UserService,
    UserResolver,
  ],
  exports: [UserService, UserRepository], // 다른 모듈에서 사용 가능
})
export class UserModule {}
