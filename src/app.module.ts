import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // ConfigModule: 환경변수 전역 사용
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
    }),

    // GraphQLModule: 환경별 동적 설정
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // Schema 생성 (Code-first)
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,

        // 보안: 운영 환경에서 비활성화
        playground: config.get('NODE_ENV') !== 'production',
        introspection: config.get('NODE_ENV') !== 'production',

        // CORS 설정
        cors: {
          origin: config.get('CORS_ORIGIN') || true,
          credentials: true,
        },

        // 에러 포맷 (선택사항)
        // formatError: (error) => {
        //   return {
        //     message: error.message,
        //     code: error.extensions?.code,
        //     path: error.path,
        //   };
        // },
      }),
    }),

    // 모듈 등록
    PrismaModule,
    UserModule,
    BoardModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
