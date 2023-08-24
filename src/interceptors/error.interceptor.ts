import { BadRequestException, CallHandler, ExecutionContext, HttpException, InternalServerErrorException, NestInterceptor, NotFoundException } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';
import { TokenExpiredError, JsonWebTokenError} from 'jsonwebtoken'

export class ErrorInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
      return next.handle().pipe(
        catchError((err) => {
          const request = context.switchToHttp().getRequest()
          const response = context.switchToHttp().getResponse()
          // reset link or confrim link expired
          if (err instanceof TokenExpiredError) {
            let viewToRender: string;
            if(request.path === '/mailer/confirm_email'){
              viewToRender = 'auth/confirm-mail'
            } else if(request.path === '/auth/reset_password') {
              viewToRender = 'auth/forget-password'
            }
            return throwError(() => new BadRequestException({
              message: 'link expired try again', render: viewToRender
            })
            )
          }
          
          // if no token in url
          if (err instanceof JsonWebTokenError) {
            return throwError(() => new InternalServerErrorException({
              message: err.message
            }))
          }

          let message = err.getResponse().message
          if(message instanceof Array) {
           message = message.join()
          }
          // bad requests during filling form
          if(err instanceof BadRequestException) {
              let viewToRender: string;
              if(request.path === '/auth/signup'){
                viewToRender ='auth/signup'
              }
              else if(request.path === '/users/update_profile') {
                viewToRender = 'users/edit'
              }
              return throwError(() => new BadRequestException({
                message: message, render: viewToRender, user: request.body
              })
            )
          }

        return throwError(() => err);
        })
      )
  }
}