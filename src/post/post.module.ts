import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BoardModule } from '../board/board.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { PostService } from './application/services/post.service';
import {
  POST_REPOSITORY,
  SCRAP_REPOSITORY,
} from './domain/repositories/post.repository';
import { PrismaPostRepository } from './infrastructure/persistence/prisma-post.repository';
import { PrismaScrapRepository } from './infrastructure/persistence/prisma-scrap.repository';
import { PostResolver } from './presentation/resolvers/post.resolver';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, BoardModule],
  providers: [
    PostService,
    PostResolver,
    { provide: POST_REPOSITORY, useClass: PrismaPostRepository },
    { provide: SCRAP_REPOSITORY, useClass: PrismaScrapRepository },
  ],
  exports: [PostService, POST_REPOSITORY],
})
export class PostModule {}
