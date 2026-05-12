import { Module } from '@nestjs/common';
import { BoardModule } from '../../board/board.module';
import { PostModule } from '../../post/post.module';
import { UserModule } from '../../user/user.module';
import { DataLoaderFactory } from './dataloader.factory';

@Module({
  imports: [UserModule, BoardModule, PostModule],
  providers: [DataLoaderFactory],
  exports: [DataLoaderFactory],
})
export class DataLoaderModule {}
