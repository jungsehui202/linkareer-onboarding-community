import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  user: any;
  board: any;
  scrap: any;
  constructor() {
    super({
      log:
        process.env.LOG_PRISMA_QUERY === 'true'
          ? ['query', 'info', 'warn', 'error'] // 개발: 모든 쿼리 확인
          : ['error'], // 운영: 에러만
    });
  }

  async onModuleInit() {
    await this.$connect();

    if (process.env.NODE_ENV !== 'production') {
      this.$on('query' as never, (e: any) => {
        console.log('='.repeat(60));
        console.log('Query:', e.query);
        console.log('Params:', e.params);
        console.log('Duration:', e.duration + 'ms');
        console.log('='.repeat(60));
      });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
