import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createBoardLoader } from './board/application/board.dataloader';
import { BoardModule } from './board/board.module';
import { GlobalGqlExceptionFilter } from './common/filter/gql-exception.filter';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { createUserLoader } from './user/application/user.dataloader';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // 1. 환경변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
    }),

    // 2. GraphQL 설정 (Config + Prisma 동시에 사용)
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [PrismaModule],
      inject: [ConfigService, PrismaService],
      useFactory: (config: ConfigService, prisma: PrismaService) => ({
        // 스키마 설정
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,

        // 운영 환경 보안 설정 (ConfigService 사용)
        playground: config.get('NODE_ENV') !== 'production',
        introspection: config.get('NODE_ENV') !== 'production',

        // CORS 설정
        cors: {
          origin: config.get('CORS_ORIGIN') || true,
          credentials: true,
        },

        context: ({ req }) => {
          // 1. 여기서 prisma 서비스가 잘 전달되는지 확인
          // 2. 반드시 { req, loaders } 형태의 '하나의 객체'를 리턴해야 함
          return {
            req,
            loaders: {
              userLoader: createUserLoader(prisma),
              boardLoader: createBoardLoader(prisma),
            },
          };
        },
      }),
    }),

    // 3. 앱 모듈들
    PrismaModule,
    UserModule,
    BoardModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 4. 전역 예외 필터
    { provide: APP_FILTER, useClass: GlobalGqlExceptionFilter },
  ],
})
export class AppModule {}
