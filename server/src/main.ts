import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    // whitelist: false,
    // forbidNonWhitelisted: false, // 非 DTO 属性会直接报错
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
