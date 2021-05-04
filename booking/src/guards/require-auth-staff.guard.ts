import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IRequest, AuthRoles } from '@quangdvnnnn/go-n-share';
import { Observable } from 'rxjs';

@Injectable()
export class RequireAuthStaffGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
function validateRequest(
  request: IRequest,
): boolean | Promise<boolean> | Observable<boolean> {
  if (request.currentUser?.auth === AuthRoles.STAFF) {
    return true;
  }
  throw new UnauthorizedException('Cần đăng nhập để dùng chức năng này');
}
