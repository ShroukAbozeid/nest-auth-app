import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
              private jwtService: JwtService){}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && await this.isMatch(pass, user.password)){
      const { password, ...result } = user;
      return result;
    }
  }

  async login(user: any){
    const payload = { username: user.username, sub: user.userId }
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
}
