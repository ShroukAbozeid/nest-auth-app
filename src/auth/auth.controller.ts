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
  async signup(@Body() body: CreateUserDto, @Response({ passthrough: true}) res){
    const user = await this.authService.createUser(body);
    await this.setCookie(user, res)
    res.redirect('/home')
  }

  @Get('login')
  @Render('auth/login')
  getLoginForm(){
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response({passthrough: true}) res) {
    await this.setCookie(req.user, res);
    res.redirect('/home')
  }

  @Get('logout')
  logout(@Response({ passthrough: true}) res){
    res.clearCookie('access_token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date()})
    res.redirect('/')
  }

  async setCookie(user: {id: number, email: string}, res){
    const { accessToken } = await this.authService.login(user);
    return res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 1 * 24 * 60 * 1000)
    })
  }
}
