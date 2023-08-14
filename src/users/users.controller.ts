import { Controller, Get, UseGuards, Request, Response,} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req, @Response() res) {
    const user = await this.usersService.findOne(req.user.userId)
    res.render('profile', {user})
  }
}
