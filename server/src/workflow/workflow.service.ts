import { Injectable, NotFoundException } from "@nestjs/common";
import { FlagSrc } from "@/utils";

// eslint-disable-next-line ts/no-require-imports
const mockjs = require("mockjs");

const dirList: _Entity.IDirectory[] = mockjs
  .mock({
    "list|50": [
      {
        "id|+1": 1,
        type: "directory",
        name: "@ctitle(10, 20)",
        desc: "@csentence(20, 60)",
        createBy: "1",
      },
    ],
  })
  .list.map((item: any) => ({ ...item, id: `d${item.id}` }));

const list: _Workflow.IWorkflow[] = mockjs
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
        updateAt: "@datetime",
      },
    ],
  })
  .list.map((item: any) => ({ ...item, id: `${item.id}`, released: false, appId: `${item.appId}`, appLogo: FlagSrc.create() }));

@Injectable()
export class WorkflowService {
  async findOne(id: string): Promise<_Workflow.IWorkflow> {
    const item = list.find((item) => item.id === id);
    if (!item) {
      throw new NotFoundException(`Flow[${id}]不存在`);
    }
    return item;
  }

  async updateItem(userId: string, id: string, data: _Workflow.IWorkflow): Promise<_Workflow.UpdateResult> {
    const item = list.find((item) => item.id === id);
    if (!item) {
      throw new NotFoundException(`Flow[${id}]不存在`);
    }
    Object.assign(item, data, { updateAt: `${Date.now()}` });
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
