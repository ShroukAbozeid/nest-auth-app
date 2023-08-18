import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate{
 canActivate(context: ExecutionContext) {
  const request = context.switchToHttp().getRequest()
  if(!request.user || !request.user.admin) {
    throw new UnauthorizedException('Only accessiable by admins')
  }
  return true;
 } 
}