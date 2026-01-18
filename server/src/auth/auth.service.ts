import { createHash } from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CacheService } from "@/cache/cache.service";
import { TokenExpiredSecond } from "@/consts";
import type { TokenPayload } from "./index";

const Users: App.IProfileUser[] = [
  {
    id: "1",
    username: "admin",
    nickname: "小布丁",
    password: "123456",
    roles: ["Admin"],
    age: 20,
  },
  {
    id: "2",
    username: "maria",
    nickname: "多啦啊嘛",
    password: "guess",
    roles: ["Member"],
    age: 21,
  },
];

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private cacheService: CacheService,
  ) {}

  async validateUser(username: string, password: string): Promise<App.IProfileUser | undefined> {
    const user = Users.find((user) => user.username === username);
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
    const payload: TokenPayload = { sub: user.id, username: user.username, nickname: user.nickname, roles: user.roles };
    const token = await this.jwtService.signAsync(payload);
    const tokenHash = createHash("md5").update(token).digest("hex");
    this.cacheService.set(tokenHash, Date.now(), TokenExpiredSecond);
    return {
      ...user,
      token,
    };
  }
}
