import { Injectable, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { MailerService } from '../mailer/mailer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(@Inject(forwardRef(() => UsersService )) private usersService: UsersService,
              private jwtService: JwtService,
              @Inject(forwardRef(() => MailerService)) private mailerService: MailerService,
              private readonly configService: ConfigService){}


  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.isMatch(pass, user.password)){
      user.password = undefined
      return user;
    }
    return null;
  }

  async login(user: {id: number, email: string}){
    const payload = { email: user.email, id: user.id }
    return {
      accessToken: this.jwtService.sign(payload)
    }
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(password, salt);
  }

  async isMatch(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async createUser(userDto: CreateUserDto){
    let user = await this.usersService.findByEmail(userDto.email);
    if (user) {
      throw new BadRequestException('Email taken!')
    }
    const hashedPassword = await this.hashPassword(userDto.password)
    userDto.password = hashedPassword;
    user = await this.usersService.createUser(userDto);
    await this.mailerService.sendConfirmationMail(userDto.email, userDto.name)
    user.password = undefined
    return user;
  }

  generateResetPasswordToken(email: string) {
    return this.jwtService.sign({ email }, {
      secret: this.configService.get('JWT_FORGET_PASS_SECRET')
    })    
  }

  generateConfirmEmailToken(email: string) {
    return this.jwtService.sign({ email }, {
      secret: this.configService.get('JWT_EMAIL_SECRET')
    })    
  }

  async findEmailFromToken(token: string, type: string) {
    let secret = ''
    if (type === 'password') {
      secret = this.configService.get('JWT_FORGET_PASS_SECRET')
    } else if (type === 'email_confirmation') {
       secret = this.configService.get('JWT_EMAIL_SECRET')
    }
    const { email } = await this.jwtService.verify(token, { secret })
    if(!email) {
      throw new BadRequestException('Invalid token')
    }
    return email;
  }

  async forgetPassword(email: string) {
    if(!email) {
      throw new BadRequestException('No Email Provided')
    }
    const user = await this.usersService.findByEmail(email)
    await this.mailerService.sendForgetPasswordMail(email, user.name)
  }
}
