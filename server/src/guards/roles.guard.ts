import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取控制器/方法上的角色元数据
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // 没有声明权限的路由默认允许访问
    }

    const request: { user: _App.AuthUser } = context.switchToHttp().getRequest();
    const user = request.user;

    // 假设 user.roles 是数组，比如 ['admin']
    return requiredRoles.some((role) => user.roles?.includes(role as _Permission.SystemRole));
  }
}
