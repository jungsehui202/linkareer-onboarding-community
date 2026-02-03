import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BoardService } from './application/board.service';
import { BoardPrisma } from './domain/board.prisma';
import { BoardResolver } from './presentation/board.resolver';

@Module({
  imports: [PrismaModule],
  providers: [BoardPrisma, BoardService, BoardResolver],
  exports: [BoardService, BoardPrisma],
})
export class BoardModule {}
