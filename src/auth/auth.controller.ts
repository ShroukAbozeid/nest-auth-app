import { Controller, Get, Post, Render, UseGuards, Request, Body, Response, Query, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { AccessTokenPayloadDto } from './dtos/access-token-payload.dto';
import { LoginGuard } from './guards/login-guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly userService: UsersService) {}

  // signup form 
  @Get('signup')
  @Render('auth/signup')
  getSignupForm(){}

  // signup email-password
  @Post('signup')
  @Render('auth/confirm-mail')
  async signup(@Body() body: CreateUserDto, @Request() req){
    const user = await this.authService.createUser(body);
    await req.login(user, () => {
    })
    return { user }
  }

  // login form
  @Get('login')
  @Render('auth/login')
  getLoginForm(){}

  // login email-password
  @UseGuards(LoginGuard)
  @Post('login')
  async login(@Response({passthrough: true}) res) {
    res.redirect('/home')
  }

  // logout
  @Get('logout')
  logout(@Request() req, @Response() res){
    req.logout(() => {  
      req.session.destroy();
      res.redirect('/');
    });
  }

  // forget password form
  @Get('forget_password')
  @Render('auth/forget-password')
  async getForgetPassword() {}

  // send forget password email
  @Post('forget_password')
  async forgetPassword(@Body('email') email: string, @Response({ passthrough: true}) res) {
    await this.authService.forgetPassword(email)
    res.redirect('login')
  }

  // reset password form
  @Get('reset_password')
  @Render('auth/reset-password')
  async getResetPassword(@Query('token') token: string,
                      @Request() req,
                      @Response({ passthrough: true}) res) {
    const email = await this.authService.findEmailFromToken(token, 'password')
    return { email }
  }

  // reset password
  @Post('reset_password')
  async resetPassword(@Body() body: ResetPasswordDto,
                      @Request() req,
                      @Response({ passthrough: true}) res) {
    const user = await this.userService.findByEmail(body.email);
    await this.userService.updateUser(user, { password: body.password } as UpdateUserDto)
    res.redirect('login')
  }

  // google login
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req){}

  // google auth redirect
  @Get('google_redirect')
  @UseGuards(GoogleOAuthGuard)
 async googleAuthRedirect(@Request() req, @Response({ passthrough: true}) res){
    const user = await this.authService.googleLogin(req.user);
    res.redirect('/home')
  }

  // helper methods
  async setCookie(user: AccessTokenPayloadDto, res){
    const { accessToken } = await this.authService.login(user);
return res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 1 * 24 * 60 * 1000)
    })
  }
}
