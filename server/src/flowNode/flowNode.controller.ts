import { Controller, Delete, Get, Param, Post, Put, Query, Request } from "@nestjs/common";
import { BaseQueryDto } from "@/dto";
import { sleep } from "@/utils";
import { FlowNodeService } from "./flowNode.service";

@Controller("nodes")
export class FlowNodeController {
  constructor(private readonly nodesService: FlowNodeService) {}

  @Get()
  async getList(@Query() query: BaseQueryDto): Promise<FlowNode.IQueryResult> {
    await sleep(1000);
    return this.nodesService.findAll(query);
  }

  @Get(":id")
  async getItem(@Param() param: { id: string }): Promise<FlowNode.INode> {
    return this.nodesService.findOne(param.id);
  }

  @Post()
  async createItem(@Request() { user, body }: { user: App.IAuthUser; body: FlowNode.INode }): Promise<FlowNode.ICreateResult> {
    return this.nodesService.createItem(user.id, body);
  }

  @Put(":id")
  async updateItem(
    @Request() { user, body, params }: { user: App.IAuthUser; body: FlowNode.INode; params: { id: string } },
  ): Promise<FlowNode.IUpdateResult> {
    return this.nodesService.updateItem(user.id, params.id, body);
  }

  @Delete()
  async deleteItem(@Query() { id }: { id: string }): Promise<void> {
    return this.nodesService.deleteItem(id);
  }
}
