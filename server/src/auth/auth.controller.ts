import { Body, Controller, Get, Put, Request } from "@nestjs/common";
import { Public } from "../decorators";
import { MyProjectRoles, ProjectRoleConfg, SystemRoleConfg } from "../permissions";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getUser(@Request() req: { user: _App.IAuthUser }): Promise<_App.IAuthUser> {
    return req.user;
  }

  @Public()
  @Put()
  async login(@Body() body: _App.AuthLogin): Promise<_App.IProfileUser & { token: string }> {
    return this.authService.login(body);
  }

  @Get("permissions")
  async getPermissions(@Request() req: { user: _App.IAuthUser }): Promise<_Permission.QueryPermissionsResult> {
    return {
      systemRoleConfg: SystemRoleConfg,
      projectRoleConfg: ProjectRoleConfg,
      myProjectRoles: MyProjectRoles,
    };
  }
}
