import { Controller, Get, UseGuards, Request, Response} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { EmailConfirmGuard } from './auth/guards/email-confirm.guard';
import { AuthenticatedGuard } from 'src/auth/guards/auth-guard';

@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  root(@Request() req, @Response() res) {
    if(req.isAuthenticated()){
      res.redirect('home')
    } else {
      res.render('index')
    }
  }

  @UseGuards(EmailConfirmGuard)
  @UseGuards(AuthenticatedGuard)
  @Get('home')
  async home(@Request() req, @Response() res) {
    res.render('home', { user: req.user })
  }
}
