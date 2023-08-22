import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UsersService) {
    super()
  }
  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, { id: user.id, email: user.email });
  }

  async deserializeUser(payload: {id: number, email: string}, done: (err: Error, user: any) => void): Promise<any> {
    const user = await this.userService.findByEmail(payload.email)
    done(null, user);
  }
}