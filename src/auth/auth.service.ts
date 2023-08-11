import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
              private jwtService: JwtService){}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && await user.password === pass){
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
}
