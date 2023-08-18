import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class EmailConfirmGuard implements CanActivate{
 canActivate(context: ExecutionContext) {
  const request = context.switchToHttp().getRequest()
  if(!request.user || !request.user.emailConfirmed) {
    throw new UnauthorizedException('Please confirm your email first')
  }
  return true;
 } 
}