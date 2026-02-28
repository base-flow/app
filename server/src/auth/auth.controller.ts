import { Body, Controller, Get, Put, Request } from "@nestjs/common";
import { UsersMap } from "../database";
import { Public } from "../decorators";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getUser(@Request() req: { user: _App.AuthUser }): Promise<_App.AuthUser> {
    return req.user;
  }

  @Public()
  @Put()
  async login(@Body() body: _App.AuthLogin): Promise<_App.AuthUser & { token: string }> {
    return this.authService.login(body);
  }

  @Get("profile")
  async getProfile(@Request() req: { user: _App.AuthUser }): Promise<_App.MyProfile> {
    const { nickname, myProjects } = UsersMap[req.user.id];
    return {
      nickname,
      myProjects,
    };
  }
}
