import { Controller, Get, Post, Render, UseGuards, Request, Body, Response,} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CreateUserDto } from './users/dtos/create-user.dto';
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @Render('index')
  root(@Request() req) {
    return { message: 'Hello Shrouq' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('home')
  @Render('home')
  home(@Request() req) {
    return { user: req.user };
  }

  @Get('auth/signup')
  @Render('auth/signup')
  get_signup_form(){
  }

  @Post('auth/signup')
  @Render('auth/signup')
  async signup(@Body() body: CreateUserDto, @Response({ passthrough: true}) res){
    const user = await this.authService.createUser(body);
    this.loginAndRedirect(user, res)
  }

  @Get('auth/login')
  @Render('auth/login')
  get_login_form(){
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@Request() req, @Response({ passthrough: true}) res) {
    this.loginAndRedirect(req.user, res)
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

  @Get('auth/logout')
  logout(@Response({ passthrough: true}) res){
    res.cookie('access_token', undefined)
    res.redirect('/')
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req, @Response() res) {
    res.render('profile', { user: req.user})
  }
}
