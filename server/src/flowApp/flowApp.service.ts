import { Injectable, NotFoundException } from "@nestjs/common";
import { ResourceRoles } from "@/permissions";
import { extendAssign, FlagSrc } from "@/utils";

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

const memberList: FlowApp.IMember[] = mockjs
  .mock({
    "list|15": [
      {
        "id|+1": 3,
        username: "@ctitle(5, 10)",
        nickname: "@ctitle(2, 10)",
        appRole: "Developer",
      },
    ],
  })
  .list.map((item: any) => ({ ...item, id: `${item.id}` }));
memberList.unshift(
  {
    id: "1",
    username: "admin",
    nickname: "管理员",
    appRole: "Owner",
  },
  {
    id: "2",
    username: "maria",
    nickname: "吹笛子的小猪",
    appRole: "Owner",
  },
);
@Injectable()
export class FlowAppService {
  async findAll(query: FlowApp.IQuery, permission: "all" | "involved"): Promise<FlowApp.IQueryResult> {
    const result = permission === "involved" ? list.filter((item) => ResourceRoles.app[item.id]) : list;
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

  async findAllMembers(id: string): Promise<FlowApp.IMember[]> {
    return memberList;
  }

  async updateMember(id: string, member: Partial<FlowApp.IMember>): Promise<void> {
    memberList.forEach((item) => {
      if (item.id === member.id) {
        extendAssign(item, member);
      }
    });
  }

  async createMember(id: string, member: Partial<FlowApp.IMember>): Promise<FlowApp.IMember> {
    const newMember = { ...memberList[0] };
    extendAssign(newMember, { ...member, appRole: "Tester" });
    memberList.push(newMember);
    return newMember;
  }

  async deleteMemberItem(id: string, memberId: string): Promise<void> {
    memberList.splice(
      memberList.findIndex((item) => item.id === memberId),
      1,
    );
  }
}
