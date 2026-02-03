import { Controller, Get } from "@nestjs/common";
import { GotSharedList } from "@/data";
import { sleep } from "@/utils";

@Controller("gotShared")
export class GotSharedController {
  @Get()
  async getList(): Promise<_Shared.IGotShared[]> {
    await sleep(1000);
    return GotSharedList;
  }

  // @Get(":id")
  // async getItem(@Param() param: { id: string }): Promise<_Entity.IEntity> {
  //   //return this.workflowService.findOne(param.id);
  // }

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
