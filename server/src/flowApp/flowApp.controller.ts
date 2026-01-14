import { Controller, Delete, Get, Param, Post, Put, Query, Request } from "@nestjs/common";
import { BaseQueryDto } from "@/dto";
import { sleep } from "@/utils";
import { FlowAppService } from "./flowApp.service";

@Controller("app")
export class FlowAppController {
  constructor(private readonly flowAppService: FlowAppService) {}

  @Get()
  async getList(@Query() query: BaseQueryDto): Promise<FlowApp.IQueryResult> {
    await sleep(1000);
    return this.flowAppService.findAll(query);
  }

  @Get(":id")
  async getItem(@Param() param: { id: string }): Promise<FlowApp.IApp> {
    await sleep(1000);
    return this.flowAppService.findOne(param.id);
  }

  @Post()
  async createItem(@Request() { user, body }: { user: App.IAuthUser; body: FlowApp.IApp }): Promise<FlowApp.ICreateResult> {
    return this.flowAppService.createItem(user.id, body);
  }

  @Put(":id")
  async updateItem(
    @Request() { user, body, params }: { user: App.IAuthUser; body: FlowApp.IApp; params: { id: string } },
  ): Promise<FlowApp.IUpdateResult> {
    return this.flowAppService.updateItem(user.id, params.id, body);
  }

  @Delete()
  async deleteItem(@Query() { id }: { id: string }): Promise<void> {
    return this.flowAppService.deleteItem(id);
  }

  @Get(":id/member")
  async getMemberList(@Param() param: { id: string }): Promise<User.IQueryResult> {
    await sleep(1000);
    return this.flowAppService.findAllMembers(param.id);
  }
}
