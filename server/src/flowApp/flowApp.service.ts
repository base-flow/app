import { Injectable, NotFoundException } from "@nestjs/common";
import { FlagSrc } from "@/utils";

const mockjs = require("mockjs");

const list: FlowApp.IApp[] = mockjs
  .mock({
    "list|95": [
      {
        "id|+1": 1,
        name: "@ctitle(10, 20)",
        logo: "emoji://#fef7c3@:smile:@😀",
        desc: "@csentence(20, 60)",
        updateDate: "@datetime",
        totalFlows: 34,
        flowsNumber: {
          server: 12,
          browser: 3,
        },
      },
    ],
  })
  .list.map((item: any) => ({ ...item, id: `${item.id}`, logo: FlagSrc.create() }));

const memberList: User.IUser[] = mockjs
  .mock({
    "list|15": [
      {
        "id|+1": 1,
        username: "@ctitle(5, 10)",
        specialRole: "developer",
      },
    ],
  })
  .list.map((item: any) => ({ ...item, id: `${item.id}` }));

@Injectable()
export class FlowAppService {
  async findAll(query: FlowApp.IQuery): Promise<FlowApp.IQueryResult> {
    const result = list;
    // if (query.keyword) {
    //   result = result.filter((item) => item.name.includes(query.keyword!));
    // }
    const { page = 1, pageSize = 20 } = query;
    return { query, list: result.slice((page - 1) * pageSize, page * pageSize), summary: { total: result.length, page, pageSize } };
  }

  async createItem(userId: string, data: FlowApp.IApp): Promise<FlowApp.ICreateResult> {
    const newItem: FlowApp.IApp = { ...data, id: `${Date.now()}`, updateDate: `${Date.now()}` };
    list.unshift(newItem);
    return { id: newItem.id };
  }

  async updateItem(userId: string, id: string, data: FlowApp.IApp): Promise<FlowApp.IUpdateResult> {
    const item = list.find((item) => item.id === id);
    if (!item) {
      throw new NotFoundException(`App[${id}]不存在`);
    }
    Object.assign(item, data, { updateDate: `${Date.now()}` });
    return { id };
  }

  async deleteItem(id: string): Promise<void> {
    list.splice(
      list.findIndex((item) => item.id === id),
      1,
    );
  }

  async findOne(id: string): Promise<FlowApp.IApp> {
    const item = list.find((item) => item.id === id);
    if (!item) {
      throw new NotFoundException(`App[${id}]不存在`);
    }
    return item;
  }

  async findAllMembers(id: string): Promise<User.IQueryResult> {
    return { query: {}, list: memberList, summary: { total: memberList.length, page: 1, pageSize: memberList.length } };
  }
}
