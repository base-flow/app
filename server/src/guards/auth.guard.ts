import { createHash } from "node:crypto";
import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import type { TokenPayload } from "@/auth";
import { CacheService } from "@/cache/cache.service";
import { TokenExpiredSecond } from "@/consts";
import { IS_PUBLIC_KEY } from "../decorators";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
    private cacheService: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return true;
    }
    const request: Request & { user: App.IAuthUser } = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      console.log("Token解析失败!token", new Date());
      throw new UnauthorizedException("Token解析失败");
    }
    const tokenHash = createHash("md5").update(token).digest("hex");
    const tokenUpdateTime = await this.cacheService.get(tokenHash);
    if (!tokenUpdateTime) {
      console.log("Token解析失败!tokenUpdateTime", new Date());
      throw new UnauthorizedException("Token解析失败");
    }
    try {
      const { sub, username, roles }: TokenPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get("JWT_SECRET"),
      });
      const user: App.IAuthUser = { id: sub, username, roles };
      request.user = user;
      const now = Date.now();
      const dt = (now - Number(tokenUpdateTime)) / 1000;
      if (dt > TokenExpiredSecond / 2) {
        console.log("token 续期", new Date(now));
        this.cacheService.set(tokenHash, now, TokenExpiredSecond);
        // TODO 可以先设置一个同步的变量，避免redis更新时，下一个请求又重来
      } else {
        console.log("token 无需续期");
      }
    } catch {
      console.log("Token解析失败", new Date());
      throw new UnauthorizedException("Token解析失败");
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
