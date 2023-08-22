import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class EmailConfirmGuard implements CanActivate{
 canActivate(context: ExecutionContext) {
  const user = context.switchToHttp().getRequest().user
  if(!user || !user.emailConfirmed) {
    throw new UnauthorizedException('Please confirm your email first')
  }
  return true;
 } 
}