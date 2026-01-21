import { Controller, Get, Param } from "@nestjs/common";
import { sleep } from "@/utils";

@Controller("personal")
export class PersonalController {
  @Get(":id")
  async getItem(@Param() param: { id: string }): Promise<_Personal.IPersonal> {
    await sleep(1000);
    return { id: "1", totalWorkflows: 10, totalNodes: 12, username: "hiisea", nickname: "会飞的小猪", createBy: "2" };
  }
}
