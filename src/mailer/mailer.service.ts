import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from "@nestjs-modules/mailer"
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService,
              private readonly jwtService: JwtService,
              private readonly configService: ConfigService){}

  async sendConfirmationMail(email: string, name: string) {
    const url = this.generateConfirmationLink(email);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Greeting',
      template: 'confirmation-email',
      context: {
        name: name,
        url: url
      }
    })
  }

  async findEmailFromToken(token: string) {
    const { email } = await this.jwtService.verify(token)
    if(!email) {
      throw new BadRequestException('Invalid token')
    }
    return email;
  }

  generateConfirmationLink(email: string) {
    const payload = { email }
    const token = this.jwtService.sign(payload)
    return this.configService.get('EMAIL_CONFIRMATION_URL') + '?token=' + token
  }
}
