import { Controller, Get, UseGuards, Request, Response, Post} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmailConfirmGuard } from 'src/auth/guards/email-confirm.guard';

@UseGuards(EmailConfirmGuard)
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req, @Response() res) {
    res.render('users/profile', { user: req.user })
  }

  @Get('edit')
  async getEditForm(@Request() req, @Response() res) {
    res.render('users/edit', { user: req.user })
  }

  @Post('/update_profile')
  async update(@Request() req, @Response() res) {
    const user = this.usersService.updateUser(req.user, req.body)
    res.redirect('/users/profile')
  }
}
