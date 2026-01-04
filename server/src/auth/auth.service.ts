import { createHash } from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CacheService } from "@/cache/cache.service";
import { TokenExpiredSecond } from "@/consts";
import type { TokenPayload } from "./index";

@Injectable()
export class AuthService {
  private readonly users = [
    {
      id: "1",
      username: "admin",
      password: "123456",
      roles: ["admin", "user"],
      age: 20,
    },
    {
      id: "2",
      username: "maria",
      password: "guess",
      roles: ["user"],
      age: 21,
    },
  ];

  constructor(
    private jwtService: JwtService,
    private cacheService: CacheService,
  ) {}

  async validateUser(username: string, password: string): Promise<App.IProfileUser | undefined> {
    const user = this.users.find((user) => user.username === username);
    if (user && user.password === password) {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return undefined;
  }

  async login({ username, password }: App.AuthLogin): Promise<App.IProfileUser & { token: string }> {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new NotFoundException("用户名或密码错误");
    }
    const payload: TokenPayload = { sub: user.id, username: user.username, roles: user.roles };
    const token = await this.jwtService.signAsync(payload);
    const tokenHash = createHash("md5").update(token).digest("hex");
    this.cacheService.set(tokenHash, Date.now(), TokenExpiredSecond);
    return {
      ...user,
      token,
    };
  }
}
