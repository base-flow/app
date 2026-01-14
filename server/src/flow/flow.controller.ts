import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from "@nestjs/common";
import { sleep } from "@/utils";
import { FlowService } from "./flow.service";

@Controller("flow")
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  @Get()
  async getList(@Request() { query }: { query: Flow.IQuery }): Promise<Flow.IQueryResult> {
    await sleep(1000);
    return this.flowService.findAll(query);
  }

  @Get(":id")
  async getItem(@Param() param: { id: string }): Promise<Flow.IFlow> {
    return this.flowService.findOne(param.id);
  }

  @Post()
  async createItem(@Request() { user, body }: { user: App.IAuthUser; body: Flow.IFlow }): Promise<FlowApp.ICreateResult> {
    return this.flowService.createItem(user.id, body);
  }

  @Put(":id")
  async updateItem(
    @Request() { user, body, params }: { user: App.IAuthUser; body: Flow.IFlow; params: { id: string } },
  ): Promise<FlowApp.IUpdateResult> {
    return this.flowService.updateItem(user.id, params.id, body);
  }

  @Delete(":id")
  async deleteItem(@Param() param: { id: string }): Promise<void> {
    return this.flowService.deleteItem(param.id);
  }

  @Delete()
  async batchDelete(@Body() { ids }: { ids: string[] }): Promise<void> {
    await sleep(1000);
    return this.flowService.batchDelete(ids);
  }
}
