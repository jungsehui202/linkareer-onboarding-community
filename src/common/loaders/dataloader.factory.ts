import { Injectable } from '@nestjs/common';
import {
  createBoardLoader,
  createChildBoardsLoader,
  createPostCountLoader,
} from '../../board/application/board.dataloader';
import { PrismaService } from '../../prisma/prisma.service';
import { createUserLoader } from '../../user/application/user.dataloader';
import { IDataLoaders } from './dataloader.interface';

@Injectable()
export class DataLoaderFactory {
  constructor(private readonly prisma: PrismaService) {}

  // 매 요청마다 호출되어 새로운 로더 세트를 생성
  create(): IDataLoaders {
    return {
      userLoader: createUserLoader(this.prisma),
      boardLoader: createBoardLoader(this.prisma),
      childBoardsLoader: createChildBoardsLoader(this.prisma),
      postCountLoader: createPostCountLoader(this.prisma),
    };
  }
}
