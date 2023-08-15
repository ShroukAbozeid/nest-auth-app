import { Controller, Get,  Render, UseGuards, Request, Response} from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  root(@Request() req, @Response() res) {
    if(req.cookies.access_token){
      res.redirect('home')
    } else {
      res.render('index')
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('home')
  async home(@Request() req, @Response() res) {
    const user = await this.usersService.findOne(req.user.userId)
    res.render('home', {user})
  }
}
