import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // 1. super 설정 시 log 옵션을 세밀하게 조정합니다.
    const isLogEnabled = process.env.LOG_PRISMA_QUERY === 'true';

    super({
      log: isLogEnabled
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'stdout', level: 'info' },
            { emit: 'stdout', level: 'warn' },
            { emit: 'stdout', level: 'error' },
          ]
        : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();

    // 2. 이벤트 리스너 등록 (타입 캐스팅 문제 해결)
    if (process.env.LOG_PRISMA_QUERY === 'true') {
      (this as any).$on('query', (e: any) => {
        console.log(
          '\x1b[36m%s\x1b[0m',
          '======================== PRISMA QUERY ========================',
        );
        console.log(`Query: ${e.query}`);
        console.log(`Params: ${e.params}`);
        console.log(`Duration: ${e.duration}ms`);
        console.log(
          '\x1b[36m%s\x1b[0m',
          '==============================================================',
        );
      });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
