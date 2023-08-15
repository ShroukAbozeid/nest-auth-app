import { Controller, Get, Post, Render, UseGuards, Request, Body, Response,} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dtos/create-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('signup')
  @Render('auth/signup')
  getSignupForm(){
  }

  @Post('signup')
  @Render('auth/signup')
  async signup(@Body() body: CreateUserDto, @Response({ passthrough: true}) res){
    const user = await this.authService.createUser(body);
    this.loginAndRedirect(user, res)
  }

  @Get('login')
  @Render('auth/login')
  getLoginForm(){
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req, @Response({ passthrough: true}) res) {
    this.loginAndRedirect(req.user, res)
  }

  @Get('logout')
  logout(@Response({ passthrough: true}) res){
    res.cookie('access_token', undefined)
    res.redirect('/')
  }

  async loginAndRedirect(user: {id: number, email: string}, @Response({ passthrough: true}) res) {
    const { accessToken } = await this.authService.login(user);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 1 * 24 * 60 * 1000)
    })
   return res.redirect('/home')
  }
}
