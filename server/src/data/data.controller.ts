import { Controller, Get, NotFoundException, Param, Put, Request } from "@nestjs/common";
import { EntityMap } from "@/database";
import { sleep } from "@/utils";

@Controller("data")
export class DataController {
  @Get(":id")
  async getItem(@Param() param: { id: string }): Promise<_Data.IDataDetail> {
    await sleep(1000);
    const entity = EntityMap[param.id] as _Data.IData & _Data.IDataDetail;
    if (!entity) {
      throw new NotFoundException();
    }
    return {
      id: param.id,
      content:
        entity.content ||
        JSON.stringify({
          name: "data",
          type: "ͼOBJECTͼ",
        }),
    };
  }
  @Put(":id")
  async updateItem(@Request() { body, params }: { body: _Data.IDataDetail; params: { id: string } }): Promise<_Data.UpdateResult> {
    await sleep(1000);
    const entity = EntityMap[params.id] as _Data.IData & _Data.IDataDetail;
    if (!entity) {
      throw new NotFoundException();
    }
    entity.content = body.content;
    return {
      id: params.id,
    };
  }
}
