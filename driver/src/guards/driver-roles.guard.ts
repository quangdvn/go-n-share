import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRequest } from '@quangdvnnnn/go-n-share';

@Injectable()
export class DriverRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<string>('role', context.getHandler());
    if (!role) {
      return true;
    }
    const request: IRequest = context.switchToHttp().getRequest();
    const curUser = request.currentUser;
    return matchRoles(role, curUser?.data.role);
  }
}

function matchRoles(pathRole: string, curRole: string): boolean {
  if (pathRole === curRole) return true;

  throw new ForbiddenException(
    'Tài khoản không được phép thực hiện chức năng này',
  );
}
