import { Injectable } from "@nestjs/common";

const mockjs = require("mockjs");

const list: User.IUser[] = mockjs
  .mock({
    "list|95": [
      {
        "id|+1": 3,
        username: "@ctitle(5, 10)",
      },
    ],
  })
  .list.map((item: any) => ({ ...item, id: `${item.id}` }));

list.unshift(
  {
    id: "1",
    username: "admin",
    age: 20,
    password: "123456",
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
  },
  {
    id: "2",
    username: "maria",
    age: 21,
    password: "guess",
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
  },
);
@Injectable()
export class UserService {
  async findAll(query: User.IQuery): Promise<User.IQueryResult> {
    let result = list;
    if (query.keyword) {
      result = result.filter((item) => item.username.includes(query.keyword!));
    }
    const { page = 1, pageSize = 20 } = query;
    return { query, list: result.slice((page - 1) * pageSize, page * pageSize), summary: { total: result.length, page, pageSize } };
  }

  async findOne(username: string): Promise<User.IUser | undefined> {
    return list.find((user) => user.username === username);
  }
}
