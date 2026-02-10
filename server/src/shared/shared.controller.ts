import { Body, Controller, Delete, Get, NotFoundException, Param, Put, Request } from "@nestjs/common";
import { EntityMap, SharedList, SharedMap } from "@/data";
import { escapeRegExp, sleep } from "@/utils";

@Controller("shared")
export class SharedController {
  @Get()
  async getList(@Request() { user, query }: { user: _App.AuthUser; query: _Shared.Query }): Promise<_Shared.IShared[]> {
    await sleep(1000);
    return SharedList.filter((item) => item.spaceType === query.spaceType && item.spaceId === query.spaceId).map((item) => ({
      ...item,
      content: undefined,
    }));
  }

  @Get(":id")
  async getItem(@Param() param: { id: string }): Promise<_Shared.IShared> {
    await sleep(1000);
    if (!SharedMap[param.id]) {
      throw new NotFoundException();
    }
    return SharedMap[param.id];
  }

  @Get(":id/content")
  async getContent(
    @Request() { user, params, query }: { user: _App.AuthUser; params: { id: string }; query: _Entity.Query },
  ): Promise<_Entity.QueryResult> {
    await sleep(1000);
    query.page = Number(query.page) || 1;
    const shared = SharedMap[params.id];
    if (!shared) {
      throw new NotFoundException();
    }
    const contentList = shared.content;
    const isOwner = shared.createBy === user.username;
    if (!query.dir) {
      return {
        query: {},
        list: contentList.map((item) => ({ ...item, path: isOwner ? item.path : "", children: undefined })),
        summary: { total: contentList.length, page: 1, pageSize: 100, path: "" },
      };
    } else {
      const folder = EntityMap[query.dir] as _App.IDirectory;
      if (!folder) {
        throw new NotFoundException();
      }
      const pathList = contentList
        .filter((item) => item.type === "directory")
        .map((item) => `${item.path.split("/").slice(0, -1).join("/")}/`)
        .sort((a, b) => b.length - a.length)
        .map(escapeRegExp);
      const pathReg = new RegExp(`^(?:${pathList.join("|")})`);
      let showPath = false;
      let list = folder.children!;
      if (query.type) {
        showPath = true;
        list = Object.keys(EntityMap)
          .filter((id) => {
            const item = EntityMap[id];
            return (
              item.parentId &&
              item.type === query.type &&
              item.path.includes(`/${query.dir} `) &&
              (query.keyword ? item.name.includes(query.keyword) : true)
            );
          })
          .map((id) => EntityMap[id]);
      } else if (query.keyword) {
        showPath = true;
        list = Object.keys(EntityMap)
          .filter((id) => {
            const item = EntityMap[id];
            return item.parentId && item.path.includes(`/${query.dir} `) && (query.keyword ? item.name.includes(query.keyword) : true);
          })
          .map((id) => EntityMap[id]);
      }

      const { page = 1 } = query;
      const pageSize = 20;
      return {
        query,
        list: list.slice((page - 1) * pageSize, page * pageSize).map((item) => {
          return { ...item, children: undefined, path: showPath ? `/${shared.id} ${shared.name}/${item.path.replace(pathReg, "")}` : "" };
        }),
        summary: { total: list.length, page, pageSize, path: `/${shared.id} ${shared.name}/${folder.path.replace(pathReg, "")}` }, //spaceType, spaceId
      };
    }
  }

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

  @Put(":id/content")
  async batchPutContentItem(@Request() { params, body }: { params: { id: string }; body: { data: { ids: string[] } } }): Promise<void> {
    await sleep(1000);
    const item = SharedMap[params.id];
    if (!item) {
      throw new NotFoundException();
    }
    item.content = item.content.concat(...body.data.ids.map((id) => EntityMap[id]));
  }

  @Delete(":id/content")
  async batchDeleteContentItem(@Request() { params, body }: { params: { id: string }; body: { ids: string[] } }): Promise<void> {
    await sleep(1000);
    const item = SharedMap[params.id];
    if (!item) {
      throw new NotFoundException();
    }
    const idMaps = body.ids.reduce(
      (obj, cur) => {
        obj[cur] = true;
        return obj;
      },
      {} as { [id: string]: true },
    );
    item.content = item.content.filter((item) => !idMaps[item.id]);
  }
}
