import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { MailerModule as NestMailerModule } from  '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async(configService: ConfigService) => ({
        secret: configService.get<string>('JWT_EMAIL_SECRET'),
        signOptions: {expiresIn: '1d'}
      }),
      inject: [ConfigService]
    }),
    NestMailerModule.forRootAsync({
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
      }),
      inject: [ConfigService]
    }),
    UsersModule
  ],
  providers: [MailerService],
  exports: [MailerService],
  controllers: [MailerController]
})
export class MailerModule {}
