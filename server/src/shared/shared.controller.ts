import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Request } from "@nestjs/common";
import { EntityMap, PersonalsMap, ProjectsMap, SharedList, SharedMap } from "@/database";
import { escapeRegExp, randomInt, sleep } from "@/utils";

const Mock = require("mockjs");
var Random = Mock.Random;

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

  @Post()
  async createItem(@Request() { user, body }: { user: _App.AuthUser; body: _Shared.IShared }): Promise<_Shared.CreateResult> {
    await sleep(1000);
    const { name, expiration, password, urlWithPassword, spaceType, spaceId } = body;
    const sharedId = `${Date.now()}`;
    const shared: _Shared.IShared = {
      id: sharedId,
      name,
      expiration,
      password,
      urlWithPassword,
      expiresAt: Date.now(),
      createAt: Random.datetime(),
      viewed: randomInt(10, 100),
      spaceType,
      spaceId,
      spaceDir: "",
      spaceName: "",
      spaceRemark: "",
      spaceLogo: "",
      createBy: user.username,
    };
    if (spaceType === "personal") {
      const space = PersonalsMap[spaceId];
      shared.spaceDir = space.dir;
      shared.spaceName = space.nickname;
      shared.spaceRemark = space.username;
      shared.spaceLogo = space.avatar;
    } else {
      const space = ProjectsMap[spaceId];
      shared.spaceDir = space.dir;
      shared.spaceName = space.name;
      shared.spaceRemark = "";
      shared.spaceLogo = space.logo;
    }
    SharedMap[sharedId] = { ...shared, content: [] };
    SharedList.push(SharedMap[sharedId]);
    return { id: sharedId };
  }

  @Put(":id")
  async updateItem(
    @Request() { user, body, params }: { user: _App.AuthUser; body: _Shared.IShared; params: { id: string } },
  ): Promise<_Entity.UpdateResult> {
    await sleep(1000);
    const item = SharedMap[params.id];
    if (!item) {
      throw new NotFoundException();
    }
    const { name, expiration, password, urlWithPassword } = body;
    Object.assign(item, { name, expiration, password, urlWithPassword });
    return { id: params.id };
  }

  @Delete(":id")
  async deleteItem(@Request() { params }: { params: { id: string } }): Promise<void> {
    await sleep(1000);
    const item = SharedMap[params.id];
    if (!item) {
      throw new NotFoundException();
    }
    const index = SharedList.findIndex((item) => item.id === params.id);
    SharedList.splice(index, 1);
    delete SharedMap[params.id];
  }

  @Get(":id/content")
  async getContent(
    @Request() { user, params, query }: { user: _App.AuthUser; params: { id: string }; query: _Entity.Query },
  ): Promise<_Entity.QueryResult> {
    await sleep(1001);

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
      const folder = EntityMap[query.dir] as _Entity.IDirectory;
      if (!folder) {
        throw new NotFoundException();
      }
      const pathList = contentList
        .filter((item) => item.type === "directory")
        .map((item) => `${item.path.split("/").slice(0, -1).join("/")}/`)
        .sort((a, b) => b.length - a.length)
        .map(escapeRegExp);
      const pathReg = new RegExp(`^(?:${pathList.join("|")})`);

      query.page = Number(query.page) || 1;
      const { dir, type, runtime, kind, keyword, descendants, page } = query;
      let list: _Entity.IEntity[];

      if (descendants) {
        list = Object.keys(EntityMap)
          .filter((id) => {
            const item = EntityMap[id];
            return (
              item.parentId &&
              item.path.includes(`/${dir} `) &&
              item.type !== "directory" && //不展示目录
              (type ? item.type === type : true) &&
              (runtime ? item.runtime === runtime : true) &&
              (kind ? item.kind === kind : true) &&
              (keyword ? item.name.includes(keyword) : true)
            );
          })
          .map((id) => EntityMap[id]);
      } else {
        list = folder.children!.filter((item) => {
          return (
            (item.type === "directory" ||
              ((type ? item.type === type : true) && (runtime ? item.runtime === runtime : true) && (kind ? item.kind === kind : true))) &&
            (keyword ? item.name.includes(keyword) : true)
          );
        });
      }

      const pageSize = 20;
      return {
        query,
        list: list.slice((page - 1) * pageSize, page * pageSize).map((item) => {
          return { ...item, children: undefined, path: descendants ? `/${shared.id} ${shared.name}/${item.path.replace(pathReg, "")}` : "" };
        }),
        summary: { total: list.length, page, pageSize, path: `/${shared.id} ${shared.name}/${folder.path.replace(pathReg, "")}` },
      };
    }
  }

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
