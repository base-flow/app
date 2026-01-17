import { Injectable } from "@nestjs/common";

const mockjs = require("mockjs");

const list: User.IUser[] = mockjs
  .mock({
    "list|95": [
      {
        "id|+1": 3,
        username: "@ctitle(5, 10)",
        nickname: "@ctitle(2, 10)",
        phone: "13984783987",
      },
    ],
  })
  .list.map((item: any) => ({ ...item, id: `${item.id}` }));

list.unshift(
  {
    id: "1",
    username: "admin",
    nickname: "管理员",
    phone: "13984783987",
    age: 20,
    password: "123456",
  },
  {
    id: "2",
    username: "maria",
    nickname: "吹笛子的小猪",
    phone: "13783445874",
    age: 21,
    password: "guess",
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
