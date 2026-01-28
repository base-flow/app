import { Body, Controller, Get, Put, Request } from "@nestjs/common";
import { Public } from "../decorators";
import { MyProjectRoles, ProjectRoleConfg, SystemRoleConfg } from "../permissions";
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

  @Get("permissions")
  async getPermissions(@Request() req: { user: _App.AuthUser }): Promise<_Permission.QueryPermissionsResult> {
    return {
      systemRoleConfg: SystemRoleConfg,
      projectRoleConfg: ProjectRoleConfg,
      myProjectRoles: MyProjectRoles,
    };
  }
}
