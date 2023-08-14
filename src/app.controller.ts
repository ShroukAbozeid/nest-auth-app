import { Controller, Get,  Render, UseGuards, Request, Response} from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Render('index')
  root(@Request() req) {
    return { message: 'Hello Shrouq' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('home')
  async home(@Request() req, @Response() res) {
    const user = await this.usersService.findOne(req.user.userId)
    console.log(user)
    res.render('home', {user})
  }
}
