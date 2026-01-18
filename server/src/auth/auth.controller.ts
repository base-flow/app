import { Body, Controller, Get, Put, Request } from "@nestjs/common";
import { Public } from "../decorators";
import { AppRolesConfg, ResourceRoles, SysRolesConfg } from "../permissions";
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

  @Get("permissions")
  async getPermissions(@Request() req: { user: App.IAuthUser }): Promise<App.IQueryPermissionsResult> {
    return {
      sysRolesConfg: SysRolesConfg,
      appRolesConfg: AppRolesConfg,
      resourceRoles: ResourceRoles,
    };
  }
}
