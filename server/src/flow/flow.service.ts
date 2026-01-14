import { Injectable, NotFoundException } from "@nestjs/common";
import { FlagSrc } from "@/utils";

// eslint-disable-next-line ts/no-require-imports
const mockjs = require("mockjs");

const list: Flow.IFlow[] = mockjs
  .mock({
    "list|50": [
      {
        "id|+1": 1,
        version: "0.0.1",
        commitId: "123e4567-e89b-12d3-a456-426614174000",
        name: "@ctitle(10, 20)",
        desc: "@csentence(20, 60)",
        runtime: "server",
        content: "@cparagraph(50, 100)",
        nodes: "@integer(2, 100)",
        connectors: "@integer(0, 10)",
        appId: "@integer(1, 50)",
        appName: "@ctitle(10, 20)",
        appLogo: "emoji://#fef7c3@:smile:@😀",
        updateDate: "@datetime",
      },
    ],
  })
  .list.map((item: any) => ({ ...item, id: `${item.id}`, released: false, appId: `${item.appId}`, appLogo: FlagSrc.create() }));

@Injectable()
export class FlowService {
  async findAll(query: Flow.IQuery): Promise<Flow.IQueryResult> {
    let result = list;
    if (query.keyword) {
      result = result.filter((item) => item.id === query.keyword || item.name.includes(query.keyword!));
    }
    if (query.templated) {
      result = result.filter((item) => item.templated);
    }
    const { page = 1 } = query;
    const pageSize = 20;
    return {
      query,
      list: result.slice((page - 1) * pageSize, page * pageSize).map((item) => {
        if (!query.templated) {
          return { ...item, appLogo: undefined, appName: undefined };
        }
        return item;
      }),
      summary: { total: result.length, page, pageSize },
    };
  }

  async findOne(id: string): Promise<Flow.IFlow> {
    const item = list.find((item) => item.id === id);
    if (!item) {
      throw new NotFoundException(`Flow[${id}]不存在`);
    }
    return item;
  }

  async createItem(userId: string, data: Flow.IFlow): Promise<Flow.ICreateResult> {
    const newItem: Flow.IFlow = { ...data, id: `${Date.now()}`, updateDate: `${Date.now()}` };
    list.unshift(newItem);
    return { id: newItem.id };
  }

  async updateItem(userId: string, id: string, data: Flow.IFlow): Promise<Flow.IUpdateResult> {
    const item = list.find((item) => item.id === id);
    if (!item) {
      throw new NotFoundException(`Flow[${id}]不存在`);
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

  async batchDelete(ids: string[]): Promise<void> {
    list.splice(
      list.findIndex((item) => item.id === ids[0]),
      1,
    );
  }
}
