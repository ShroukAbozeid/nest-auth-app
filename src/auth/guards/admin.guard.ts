import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate{
 canActivate(context: ExecutionContext) {
  const user = context.switchToHttp().getRequest().user
  if(!user || !user.admin) {
    throw new UnauthorizedException('Only for admins')
  }
  return true;
 } 
}