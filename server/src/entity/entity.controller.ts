import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Request } from "@nestjs/common";
import { EntityMap } from "@/database";
import { sleep } from "@/utils";

@Controller("entity")
export class EntityController {
  @Get()
  async getList(@Request() { query }: { query: _Entity.Query }): Promise<_Entity.QueryResult> {
    await sleep(1000);
    const folder = EntityMap[query.dir || ""] as _Entity.IDirectory;
    if (!folder) {
      throw new NotFoundException();
    }
    query.page = Number(query.page) || 1;
    const { dir, type, runtime, kind, keyword, scope, withDirectory, page } = query;
    const { spaceType, spaceId, path } = folder;
    let list: _Entity.IEntity[];
    if (scope) {
      list = Object.keys(EntityMap)
        .filter((id) => {
          const item = EntityMap[id];
          return (
            item.parentId &&
            item.path.includes(`/${dir} `) &&
            // 如果是目录并且withDirectory，则不受type/runtime/kind的限制，始终返回
            ((item.type === "directory" && withDirectory) ||
              ((type ? item.type === type : true) && (runtime ? item.runtime === runtime : true) && (kind ? item.kind === kind : true))) &&
            (keyword ? item.name.includes(keyword) : true)
          );
        })
        .map((id) => EntityMap[id]);
    } else {
      list = folder.children!.filter((item) => {
        return (
          // 如果是目录并且withDirectory，则不受type/runtime/kind的限制，始终返回
          ((item.type === "directory" && withDirectory) ||
            ((type ? item.type === type : true) && (runtime ? item.runtime === runtime : true) && (kind ? item.kind === kind : true))) &&
          (keyword ? item.name.includes(keyword) : true)
        );
      });
    }
    //type === "directory"用于复制文件时搜索目录树，其path仅用于确认提示
    const pageSize = 20;
    return {
      query,
      list: list.slice((page - 1) * pageSize, page * pageSize).map((item) => {
        return { ...item, children: undefined, path: scope || type === "directory" ? item.path : "" };
      }),
      summary: { total: list.length, page, pageSize, path }, //spaceType, spaceId
    };
  }

  @Get(":id")
  async getItem(@Param() param: { id: string }): Promise<_Entity.IEntity> {
    await sleep(1000);
    const entity = EntityMap[param.id];
    if (!entity) {
      throw new NotFoundException();
    }
    return entity;
  }

  @Get(":id/checkAlreadyExists")
  async checkAlreadyExists(@Request() { params, query }: { params: { id: string }; query: { name: string } }): Promise<{ result: boolean }> {
    await sleep(5000);
    const entity = EntityMap[params.id] as _Entity.IDirectory;
    if (!entity) {
      throw new NotFoundException();
    }
    return { result: entity.children!.some((item) => item.name === query.name) };
  }

  @Post()
  async createItem(@Request() { user, body }: { user: _App.AuthUser; body: _Entity.IEntity }): Promise<_Entity.CreateResult> {
    await sleep(1000);
    if (body.type === "directory") {
      const newEntity: _Entity.IDirectory = { ...body };

      // path: string;
      // spaceId: string;
      // spaceType: EntitySpace;
      // spaceDir: string;};
    } else if (body.type === "workflow") {
      const newEntity: _Workflow.IWorkflow = { ...body };
    }

    return { id: "123" };
  }

  @Put(":id")
  async updateItem(@Request() { body, params }: { body: _Entity.IEntity; params: { id: string } }): Promise<_Entity.UpdateResult> {
    await sleep(1000);
    const entity = EntityMap[params.id];
    if (!entity) {
      throw new NotFoundException();
    }
    entity.name = body.name || entity.name;
    entity.desc = body.desc || entity.desc;
    return { id: params.id };
  }

  // @Delete(":id")
  // async deleteItem(@Param() param: { id: string }): Promise<void> {
  //   //return this.workflowService.deleteItem(param.id);
  // }

  @Delete()
  async batchDelete(@Body() { ids }: { ids: string[] }): Promise<void> {
    await sleep(1000);
    console.log(ids);
    ids.forEach((id) => {
      const item = EntityMap[id];
      const parent = EntityMap[item.parentId] as _Entity.IDirectory;
      parent.children = parent.children!.filter((sub) => sub.id !== id);
      delete EntityMap[id];
    });
  }
}
