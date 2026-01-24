import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from "@nestjs/common";
import { sleep } from "@/utils";
import { EntityList } from "./data";

console.log(EntityList);

@Controller("entity")
export class EntityController {
  @Get()
  async getList(@Request() { query }: { query: _Entity.Query }): Promise<_Entity.QueryResult> {
    await sleep(1000);
    const list: _Entity.IEntity[] = EntityList;
    const { page = 1 } = query;
    const pageSize = 20;
    return {
      query,
      list: list.slice((page - 1) * pageSize, page * pageSize).map((item) => ({ ...item, children: undefined })) as any[],
      summary: { total: list.length, page, pageSize },
    };
  }

  // @Get(":id")
  // async getItem(@Param() param: { id: string }): Promise<_Entity.IEntity> {
  //   //return this.workflowService.findOne(param.id);
  // }

  // @Post()
  // async createItem(@Request() { user, body }: { user: _App.IAuthUser; body: _Entity.IEntity }): Promise<_Entity.CreateResult> {
  //   //return this.workflowService.createItem(user.id, body);
  // }

  // @Put(":id")
  // async updateItem(
  //   @Request() { user, body, params }: { user: _App.IAuthUser; body: _Entity.IEntity; params: { id: string } },
  // ): Promise<_Entity.UpdateResult> {
  //   //return this.workflowService.updateItem(user.id, params.id, body);
  // }

  // @Delete(":id")
  // async deleteItem(@Param() param: { id: string }): Promise<void> {
  //   //return this.workflowService.deleteItem(param.id);
  // }

  // @Delete()
  // async batchDelete(@Body() { ids }: { ids: string[] }): Promise<void> {
  //   await sleep(1000);
  //   // return this.workflowService.batchDelete(ids);
  // }
}
