import { Controller, Get, Param, Request } from "@nestjs/common";
import { SharedList, SharedMap } from "@/data";
import { sleep } from "@/utils";

@Controller("shared")
export class SharedController {
  @Get()
  async getList(@Request() { user, query }: { user: _App.AuthUser; query: _Shared.Query }): Promise<_Shared.IShared[]> {
    await sleep(1000);
    return SharedList.filter((item) => item.spaceType === query.spaceType && item.spaceId === query.spaceId);
  }

  @Get(":id")
  async getItem(@Param() param: { id: string }): Promise<_Shared.IShared> {
    await sleep(1000);
    return SharedMap[param.id];
  }

  // @Post()
  // async createItem(@Request() { user, body }: { user: _App.AuthUser; body: _Entity.IEntity }): Promise<_Entity.CreateResult> {
  //   //return this.workflowService.createItem(user.id, body);
  // }

  // @Put(":id")
  // async updateItem(
  //   @Request() { user, body, params }: { user: _App.AuthUser; body: _Entity.IEntity; params: { id: string } },
  // ): Promise<_Entity.UpdateResult> {
  //   //return this.workflowService.updateItem(user.id, params.id, body);
  // }

  // @Delete(":id")
  // async deleteItem(@Param() param: { id: string }): Promise<void> {
  //   //return this.workflowService.deleteItem(param.id);
  // }

  // @Delete()
  // async batchDelete(@Body() { ids }: { ids: string[] }): Promise<void> {
  //   await sleep(1000);
  //   // return this.workflowService.batchDelete(ids);
  // }
}
