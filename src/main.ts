import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 속성 제거
      forbidNonWhitelisted: true, // DTO에 없는 속성 있으면 에러
      transform: true, // 타입 자동 변환
    }),
  );

  await app.listen(4003);
}
bootstrap();
