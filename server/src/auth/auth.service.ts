import { createHash } from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CacheService } from "@/cache/cache.service";
import { TokenExpiredSecond } from "@/consts";
import { Users } from "@/database";
import type { TokenPayload } from "./index";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private cacheService: CacheService,
  ) {}

  async validateUser(username: string, password: string): Promise<_App.AuthUser | undefined> {
    const user = Users.find((user) => user.username === username);
    if (user && user.password === password) {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return undefined;
  }

  async login({ username, password }: _App.AuthLogin): Promise<_App.AuthUser & { token: string }> {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new NotFoundException("用户名或密码错误");
    }
    const { id, nickname, dir, roles } = user;
    const payload: TokenPayload = { sub: id, username, nickname, dir, roles };
    const token = await this.jwtService.signAsync(payload);
    const tokenHash = createHash("md5").update(token).digest("hex");
    this.cacheService.set(tokenHash, Date.now(), TokenExpiredSecond);
    return {
      ...user,
      token,
    };
  }
}
