import { Controller, Get, UseGuards, Request, Response, Post, Render} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmailConfirmGuard } from '../auth/guards/email-confirm.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

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

  @Get()
  @Render('users/list')
  @UseGuards(AdminGuard)
  async allUsers(){
    const users = await this.usersService.findAll()
    return { users }
  }
}
