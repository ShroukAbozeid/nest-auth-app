import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { MailerService as NestMailerService } from "@nestjs-modules/mailer"
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService,
              @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
              private readonly configService: ConfigService){}

  async sendConfirmationMail(email: string, name: string) {
    const url = this.generateConfirmationLink(email);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Greeting',
      template: 'confirmation',
      context: {
        name: name,
        url: url
      }
    })
  }

  generateConfirmationLink(email: string) {
    const token = this.authService.generateConfirmEmailToken(email)
    return this.configService.get('EMAIL_CONFIRMATION_URL') + '?token=' + token
  }

  generateResetPasswordLink(email: string) {
    const token = this.authService.generateResetPasswordToken(email)
    return this.configService.get('RESET_PASSWORD_URL') + '?token=' + token
  }

  async sendForgetPasswordMail(email: string, name: string) {
    const url = this.generateResetPasswordLink(email);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password',
      template: 'reset-password',
      context: {
        name: name,
        url: url
      }
    })
  }
}
