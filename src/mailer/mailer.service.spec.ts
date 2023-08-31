import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { MailerModule as NestMailerModule } from  '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

describe('MailerService', () => {
  let service: MailerService;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`
        }),
        NestMailerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transport: {
              host: configService.get('EMAIL_HOST'),
              port: configService.get('EMAIL_HOST'),
              secure: false,
              auth: {
                user: configService.get('EMAIL_USER'),
                pass: configService.get('EMAIL_PASS')
              }
            },
            defaults: {
              from: '"nest-modules" <' + configService.get('FROM_EMAIL') + '>'
            },
            template: {
              dir: join(__dirname, '/templates'),
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true
              }
            }
          })
        }),
      ],
      providers: [
        MailerService,
        {
          provide: AuthService,
          useValue: authService
        },
      ]
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
