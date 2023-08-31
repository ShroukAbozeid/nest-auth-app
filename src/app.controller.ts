import { Controller, Get, UseGuards, Request, Response} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { EmailConfirmGuard } from './auth/guards/email-confirm.guard';
import { AuthenticatedGuard } from './auth/guards/auth-guard';

@Controller()
export class AppController {
  @Get()
  root(@Request() req, @Response() res) {
    if(req.isAuthenticated()){
      res.redirect('home')
    } else {
      res.render('index', { message: req.flash('error') })
    }
  }

  @UseGuards(EmailConfirmGuard)
  @UseGuards(AuthenticatedGuard)
  @Get('home')
  async home(@Request() req, @Response() res) {
    res.render('home', { user: req.user, message: req.flash('error') })
  }
}
