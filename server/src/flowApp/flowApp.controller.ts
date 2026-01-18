import { Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query, Request } from "@nestjs/common";
import { BaseQueryDto } from "@/dto";
import { getPermissions } from "@/permissions";
import { sleep } from "@/utils";
import { FlowAppService } from "./flowApp.service";

@Controller("app")
export class FlowAppController {
  constructor(private readonly flowAppService: FlowAppService) {}

  @Get()
  async getList(@Request() { user, query }: { user: App.IAuthUser; query: BaseQueryDto }): Promise<FlowApp.IQueryResult> {
    await sleep(1000);
    const permissions = getPermissions(user);
    if (!permissions.app_list) {
      throw new ForbiddenException();
    }
    return this.flowAppService.findAll(query, permissions.app_list);
  }

  @Get(":id")
  async getItem(@Param() param: { id: string }): Promise<FlowApp.IApp> {
    await sleep(1000);
    return this.flowAppService.findOne(param.id);
  }

  @Post()
  async createItem(@Request() { user, body }: { user: App.IAuthUser; body: FlowApp.IApp }): Promise<FlowApp.ICreateResult> {
    const permissions = getPermissions(user);
    if (!permissions.app_create) {
      throw new ForbiddenException();
    }
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
  async getMemberList(@Param() param: { id: string }): Promise<FlowApp.IMember[]> {
    await sleep(1000);
    return this.flowAppService.findAllMembers(param.id);
  }

  @Post(":id/member")
  async createMember(
    @Request() { user, body, params }: { user: App.IAuthUser; body: Partial<FlowApp.IMember>; params: { id: string } },
  ): Promise<FlowApp.IMember> {
    return this.flowAppService.createMember(params.id, body);
  }

  @Put(":id/member")
  async updateMember(
    @Request() { user, body, params }: { user: App.IAuthUser; body: Partial<FlowApp.IMember>; params: { id: string } },
  ): Promise<void> {
    return this.flowAppService.updateMember(params.id, body);
  }

  @Delete(":id/member")
  async deleteMemberItem(@Request() { user, query, params }: { user: App.IAuthUser; query: { id: string }; params: { id: string } }): Promise<void> {
    return this.flowAppService.deleteMemberItem(params.id, query.id);
  }
}
