import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Request } from "@nestjs/common";
import { EntityList, EntityMap } from "@/data";
import { sleep } from "@/utils";

@Controller("entity")
export class EntityController {
  @Get()
  async getList(@Request() { query }: { query: _Entity.Query }): Promise<_Entity.QueryResult> {
    await sleep(1000);
    const folder = EntityMap[query.dir || ""] as _App.IDirectory;
    if (!folder) {
      throw new NotFoundException();
    }
    const { spaceType, spaceId } = folder;
    const path = folder.path;
    let list = folder.children!;
    if (query.type) {
      list = Object.keys(EntityMap)
        .filter((id) => {
          const item = EntityMap[id];
          return item.type === query.type && item.path.includes(`/${query.dir} `);
        })
        .map((id) => EntityMap[id]);
    }
    const { page = 1 } = query;
    const pageSize = 20;
    return {
      query,
      list: list.slice((page - 1) * pageSize, page * pageSize).map((item) => {
        return { ...item, children: undefined, path: query.type ? item.path : "" };
      }),
      summary: { total: list.length, page, pageSize, path, spaceType, spaceId },
    };
  }

  // @Get(":id")
  // async getItem(@Param() param: { id: string }): Promise<_Entity.IEntity> {
  //   //return this.workflowService.findOne(param.id);
  // }

  // @Post()
  // async createItem(@Request() { user, body }: { user: _App.AuthUser; body: _Entity.IEntity }): Promise<_Entity.CreateResult> {
  //   //return this.workflowService.createItem(user.id, body);
  // }

  // @Put(":id")
  // async updateItem(
  //   @Request() { user, body, params }: { user: _App.AuthUser; body: _Entity.IEntity; params: { id: string } },
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
