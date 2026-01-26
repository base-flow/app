import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from "@nestjs/common";
import { sleep } from "@/utils";
import { EntityList, EntityMap, PlatformEntityList, PlatformEntityMap } from "./data";

@Controller("entity")
export class EntityController {
  @Get()
  async getList(@Request() { query }: { query: _Entity.Query }): Promise<_Entity.QueryResult> {
    await sleep(1000);
    let list: _Entity.IEntity[] = [];
    let path: string = "";
    const dir = query.dir || "";
    if (dir.startsWith("~") || dir.startsWith("$")) {
      list = EntityList;
      path = "";
    } else if (dir.startsWith("_workflow")) {
      list = PlatformEntityList.workflow;
      path = "";
    } else if (dir.startsWith("_node")) {
      list = PlatformEntityList.node;
      path = "";
    } else {
      const folder: _App.IDirectory = EntityMap[dir] as any;
      if (folder) {
        list = folder.children;
        path = `${folder.parentPath}/${folder.id} ${folder.name}`;
      }
    }
    if (query.type) {
      list = Object.keys(EntityMap)
        .map((id) => EntityMap[id])
        .filter((item) => item.type === query.type);
    }
    const { page = 1 } = query;
    const pageSize = 20;
    return {
      query,
      list: list.slice((page - 1) * pageSize, page * pageSize).map((item) => ({ ...item, children: undefined })) as any[],
      summary: { total: list.length, page, pageSize, path },
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
