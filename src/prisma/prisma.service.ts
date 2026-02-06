// src/prisma/prisma.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' }, // $on('query')를 위해 반드시 필요
        'info',
        'warn',
        'error',
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    // 이 로그가 뜨는지 먼저 확인하세요!
    console.log('✅ Prisma Service Initialized');

    this.$on('query' as any, (e: any) => {
      // 아주 눈에 띄게 출력
      console.log(
        '\x1b[33m%s\x1b[0m',
        '------------------------------------------------------------',
      );
      console.log(`🔍 [SQL] ${e.query}`);
      console.log(`📦 [Params] ${e.params}`);
      console.log(`⚡ [Duration] ${e.duration}ms`);
      console.log(
        '\x1b[33m%s\x1b[0m',
        '------------------------------------------------------------',
      );
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
