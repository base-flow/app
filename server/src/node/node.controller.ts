import { Controller, Delete, Get, Param, Post, Put, Query, Request } from "@nestjs/common";
import { BaseQueryDto } from "@/dto";
import { sleep } from "@/utils";
import { NodeService } from "./node.service";

@Controller("node")
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Get()
  async getList(@Query() query: BaseQueryDto): Promise<_Node.QueryResult> {
    await sleep(1000);
    return this.nodeService.findAll(query);
  }

  @Get(":id")
  async getItem(@Param() param: { id: string }): Promise<_Node.INode> {
    return this.nodeService.findOne(param.id);
  }

  @Post()
  async createItem(@Request() { user, body }: { user: _App.IAuthUser; body: _Node.INode }): Promise<_Node.CreateResult> {
    return this.nodeService.createItem(user.id, body);
  }

  @Put(":id")
  async updateItem(
    @Request() { user, body, params }: { user: _App.IAuthUser; body: _Node.INode; params: { id: string } },
  ): Promise<_Node.UpdateResult> {
    return this.nodeService.updateItem(user.id, params.id, body);
  }

  @Delete()
  async deleteItem(@Query() { id }: { id: string }): Promise<void> {
    return this.nodeService.deleteItem(id);
  }
}
