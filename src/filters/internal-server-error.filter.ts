import { ArgumentsHost, Catch, ExceptionFilter, InternalServerErrorException,  } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(InternalServerErrorException)
export class InternalServerErrorFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    request.flash('error', 'Try again')
    response.redirect('/')
  }
}