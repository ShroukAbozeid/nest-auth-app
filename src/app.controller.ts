import { Controller, Get, Post, Render, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

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
  signup(@Body() body){
    console.log(body)
  }

  @Get('auth/login')
  @Render('auth/login')
  get_login_form(){
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
