import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  
  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(new (require('@nestjs/common').ValidationPipe)({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

}
bootstrap();
