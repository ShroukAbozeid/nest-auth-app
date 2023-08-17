import { Injectable, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { MailerService } from '../mailer/mailer.service';
@Injectable()
export class AuthService {
  constructor(@Inject(forwardRef(() => UsersService )) private usersService: UsersService,
              private jwtService: JwtService,
              private mailerService: MailerService){}

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
}
