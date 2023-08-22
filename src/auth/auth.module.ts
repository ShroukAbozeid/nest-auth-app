import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { MailerModule } from 'src/mailer/mailer.module';
import { GoogleStrategy } from './strategies/google.stratgy';
import { SessionSerializer } from './serializers/session.serializer';
@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => MailerModule),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async(configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {expiresIn: '1d'}
      }),
      inject: [ConfigService]
    }),
    PassportModule.register({ session: true })
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    SessionSerializer,
  ],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
