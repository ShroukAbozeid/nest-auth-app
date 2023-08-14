import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // views setup
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', '/templates/views'));
  app.set('view options', { layout: 'layouts/main' })
  app.setViewEngine('hbs');
  //cookies middleware
  const configService = app.get<ConfigService>(ConfigService);
  app.use(cookieParser(
    configService.get<string>('COOKIE_KEY'),
  ));

  // validations
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
