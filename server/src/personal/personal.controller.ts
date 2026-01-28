import { Controller, Get, Param } from "@nestjs/common";
import { PersonalsMap } from "@/data";
import { sleep } from "@/utils";

@Controller("personal")
export class PersonalController {
  @Get(":id")
  async getItem(@Param() param: { id: string }): Promise<_Personal.IPersonal> {
    await sleep(1000);
    return PersonalsMap[param.id];
  }
}
