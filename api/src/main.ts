import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { env } from './env/server';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  patchNestJsSwagger();
  const config = new DocumentBuilder()
    .setTitle('TRANSCENDENCE')
    .setDescription('The Transcendence API description')
    .setVersion('1.0')
    .addTag('transcendence')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: env.FRONTEND_URL,
    credentials: true,
    exposedHeaders: ['WWW-Authenticate'],
  });
  app.use(cookieParser());
  await app.listen(env.PORT ?? 8080);
}
bootstrap();
