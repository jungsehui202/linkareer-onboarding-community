import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PostService } from './application/post.service';
import { PostResolver } from './presentation/post.resolver';

@Module({
  imports: [PrismaModule],
  providers: [PostService, PostResolver],
  exports: [PostService],
})
export class PostModule {}
