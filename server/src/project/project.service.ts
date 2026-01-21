import { Injectable, NotFoundException } from "@nestjs/common";
import { MyProjectRoles } from "@/permissions";
import { extendAssign, FlagSrc } from "@/utils";

const mockjs = require("mockjs");

const list: _Project.IProject[] = mockjs
  .mock({
    "list|95": [
      {
        "id|+1": 1,
        name: "@ctitle(10, 20)",
        logo: "emoji://#fef7c3@:smile:@😀",
        desc: "@csentence(20, 60)",
        updateDate: "@datetime",
        totalItems: 34,
        totalWorkflows: 4,
        totalNodes: 5,
      },
    ],
  })
  .list.map((item: any) => ({ ...item, id: `${item.id}`, logo: FlagSrc.create() }));

const memberList: _Project.IMember[] = mockjs
  .mock({
    "list|15": [
      {
        "id|+1": 3,
        username: "@ctitle(5, 10)",
        nickname: "@ctitle(2, 10)",
        projectRole: "Developer",
      },
    ],
  })
  .list.map((item: any) => ({ ...item, id: `${item.id}` }));
memberList.unshift(
  {
    id: "1",
    username: "admin",
    nickname: "管理员",
    projectRole: "Owner",
  },
  {
    id: "2",
    username: "maria",
    nickname: "吹笛子的小猪",
    projectRole: "Owner",
  },
);
@Injectable()
export class ProjectService {
  async findAll(query: _Project.Query, permission: _Permission.ProjectListScope): Promise<_Project.QueryResult> {
    const result = permission === "involved" ? list.filter((item) => MyProjectRoles[item.id]) : list;
    // if (query.keyword) {
    //   result = result.filter((item) => item.name.includes(query.keyword!));
    // }
    const { page = 1, pageSize = 20 } = query;
    return { query, list: result.slice((page - 1) * pageSize, page * pageSize), summary: { total: result.length, page, pageSize } };
  }

  async createItem(userId: string, data: _Project.IProject): Promise<_Project.CreateResult> {
    const newItem: _Project.IProject = { ...data, id: `${Date.now()}`, updateDate: `${Date.now()}` };
    list.unshift(newItem);
    return { id: newItem.id };
  }

  async updateItem(userId: string, id: string, data: _Project.IProject): Promise<_Project.UpdateResult> {
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

  async findOne(id: string): Promise<_Project.IProject> {
    const item = list.find((item) => item.id === id);
    if (!item) {
      throw new NotFoundException(`App[${id}]不存在`);
    }
    return item;
  }

  async findAllMembers(id: string): Promise<_Project.IMember[]> {
    return memberList;
  }

  async updateMember(id: string, member: Partial<_Project.IMember>): Promise<void> {
    memberList.forEach((item) => {
      if (item.id === member.id) {
        extendAssign(item, member);
      }
    });
  }

  async createMember(id: string, member: Partial<_Project.IMember>): Promise<_Project.IMember> {
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
