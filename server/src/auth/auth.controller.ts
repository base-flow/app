import { Body, Controller, Get, Put, Request } from "@nestjs/common";
import { Public } from "../decorators";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getUser(@Request() req: { user: App.IAuthUser }): Promise<App.IAuthUser> {
    return req.user;
  }

  @Public()
  @Put()
  async login(@Body() body: App.AuthLogin): Promise<App.IProfileUser & { token: string }> {
    return this.authService.login(body);
  }
}
