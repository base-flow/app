import { Controller, Delete, Get, Param, Post, Put, Query, Request } from "@nestjs/common";
import { BaseQueryDto } from "@/dto";
import { sleep } from "@/utils";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getList(@Query() query: BaseQueryDto): Promise<User.IQueryResult> {
    await sleep(3000);
    return this.userService.findAll(query);
  }
}
