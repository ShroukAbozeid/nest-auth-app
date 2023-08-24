import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as session from 'express-session'
import flash = require('connect-flash')
import RedisStore from 'connect-redis'
import { createClient } from 'redis'
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { UnauthorizedFilter } from './filters/unauthorized.filter';
import * as passport from 'passport';
import { BadRequestFilter } from './filters/bad-request.fitler';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { NotFoundFilter } from './filters/not-found.filter';
import { InternalServerErrorFilter } from './filters/internal-server-error.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // views setup
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', '/templates/views'));
  app.set('view options', { layout: 'layouts/main' })
  app.setViewEngine('hbs');

  // config service to use
  const configService = app.get<ConfigService>(ConfigService);

  //cookies middleware

  // redis store
  let redisClient = createClient();
  redisClient.connect().catch(console.error)

  let redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:"
  })

  // express session
  app.use(
    session({
      secret: configService.get<string>('COOKIE_KEY'),
      name: 'sessionId', // change default name to prevent attack
      store: redisStore, // default Memory store is not production option
      cookie: { 
        httpOnly: true, // prevent xss attack
        secure: false, // allow http
        maxAge: 360000, // 1hr
        sameSite: 'lax',        
      },
      resave: false,
      saveUninitialized: false
    })
  )

  // flash messages
  app.use(flash())

  // passport session
  app.use(passport.initialize())
  app.use(passport.session())

  // validations
  app.useGlobalPipes(new ValidationPipe());

  // filters
  app.useGlobalFilters(new UnauthorizedFilter());
  app.useGlobalFilters(new BadRequestFilter());
  app.useGlobalFilters(new NotFoundFilter());
  app.useGlobalFilters(new InternalServerErrorFilter());

  app.useGlobalInterceptors(new ErrorInterceptor())


  await app.listen(3000);
}
bootstrap();
