import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BoardService } from './application/board.service';
import { BoardResolver } from './presentation/board.resolver';

@Module({
  imports: [PrismaModule],
  providers: [BoardService, BoardResolver],
  exports: [BoardService],
})
export class BoardModule {}
