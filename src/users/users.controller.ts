import { Controller, Get, UseGuards, Request, Response, Post} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req, @Response() res) {
    const user = await this.usersService.findOne(req.user.userId)
    res.render('users/profile', {user})
  }

  @UseGuards(JwtAuthGuard)
  @Get('edit')
  async getEditForm(@Request() req, @Response() res) {
    const user = await this.usersService.findOne(req.user.userId)
    res.render('users/edit', {user})
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update_profile')
  async update(@Request() req, @Response() res) {
    const user = this.usersService.updateUser(req.user.userId, req.body)
    return res.redirect('/users/profile')
  }
}
