import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(UnauthorizedException)
export class UnauthorizedFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus()

    if (exception.message == 'Please confirm your email first') { // authorized but email not confirmed
      response.render('auth/confirm-mail', {user: request.user})
    } else if (exception.message == 'Invalid credentials') { // wrong login
      response.render('auth/login', { message: exception.message})
    } else { // invalid token
      response.redirect('/')
    }
  }
}