import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
              private jwtService: JwtService){}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.isMatch(pass, user.password)){
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: {id: number, email: string}){
    const payload = { username: user.email, sub: user.id }
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
    const user = await this.usersService.findByEmail(userDto.email);
    if (user) {
      throw new BadRequestException('Email taken!')
    }
    const hashedPassword = await this.hashPassword(userDto.password)
    userDto.password = hashedPassword;
    const { password, ...result } = await this.usersService.createUser(userDto);
    return result;
  }
}
