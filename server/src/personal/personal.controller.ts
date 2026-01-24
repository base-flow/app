import { Controller, Get, Param } from "@nestjs/common";
import { sleep } from "@/utils";

@Controller("personal")
export class PersonalController {
  @Get(":username")
  async getItem(@Param() param: { username: string }): Promise<_Personal.IPersonal> {
    await sleep(1000);
    return {
      id: "aa",
      username: param.username,
      nickname: "会飞的小猪",
      dir: `~${param.username}`,
      totalWorkflows: 10,
      totalNodes: 13,
      createBy: "1",
    };
  }
}
