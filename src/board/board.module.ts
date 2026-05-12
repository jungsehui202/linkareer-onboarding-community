import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BoardService } from './application/services/board.service';
import { BOARD_REPOSITORY } from './domain/repositories/board.repository';
import { PrismaBoardRepository } from './infrastructure/persistence/prisma-board.repository';
import { BoardResolver } from './presentation/resolvers/board.resolver';

@Module({
  imports: [PrismaModule],
  providers: [
    BoardService,
    BoardResolver,
    { provide: BOARD_REPOSITORY, useClass: PrismaBoardRepository },
  ],
  exports: [BoardService, BOARD_REPOSITORY],
})
export class BoardModule {}
