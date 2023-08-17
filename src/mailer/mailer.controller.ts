import { Controller, Get, Query, Post, Body, NotFoundException, Response, UseGuards } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { UsersService } from '../users/users.service';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService,
              private readonly userService: UsersService,
              private readonly authService: AuthService){}

  @Get('confirm_email')
  async confirmEmail(@Query('token') token: string,
                     @Response({ passthrough: true}) res){
    const email = await this.authService.findEmailFromToken(token, 'email_confirmation')
    const user = await this.userService.findByEmail(email)
    await this.userService.updateUser(user, { emailConfirmed: true } as UpdateUserDto)
    res.redirect('/')
  }

  @UseGuards(JwtAuthGuard)
  @Get('/resend_verification_email')
  async sendVerificationEmail(@Query('email') email: string,
                              @Response({ passthrough: true}) res){
     const user = await this.userService.findByEmail(email)
     if(!user) {
       throw new NotFoundException
     }
     await this.mailerService.sendConfirmationMail(user.email, user.name)
     res.redirect('/')
   }
}
