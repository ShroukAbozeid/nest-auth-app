import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { join } from 'path';
import { AppModule } from './../src/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import exp from 'constants';
import { Response } from 'express';

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    app.setBaseViewsDir(join(__dirname, '..', '/templates/views'));

    app.setViewEngine('hbs');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/')
    expect(response.status).toBe(200)
    expect(response.text).toContain('Welcome to our App!')
  });
});
