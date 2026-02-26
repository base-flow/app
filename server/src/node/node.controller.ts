import { Controller, Get, NotFoundException, Param, Put, Request } from "@nestjs/common";
import { EntityMap } from "@/data";
import { sleep } from "@/utils";

@Controller("node")
export class NodeController {
  @Get(":id")
  async getItem(@Param() param: { id: string }): Promise<_Node.INodeDetail> {
    await sleep(1000);
    const entity = EntityMap[param.id] as _Node.INode;
    if (!entity) {
      throw new NotFoundException();
    }
    return {
      id: param.id,
      content: entity.content,
      released: false,
    };
  }
  @Put(":id")
  async updateItem(@Request() { body, params }: { body: _Node.INodeDetail; params: { id: string } }): Promise<_Node.UpdateResult> {
    await sleep(1000);
    const entity = EntityMap[params.id] as _Node.INode;
    if (!entity) {
      throw new NotFoundException();
    }
    entity.content = body.content;
    return {
      id: params.id,
    };
  }
}
