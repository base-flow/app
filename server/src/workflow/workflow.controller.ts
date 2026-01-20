import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from "@nestjs/common";
import { sleep } from "@/utils";
import { WorkflowService } from "./workflow.service";

@Controller("workflow")
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Get()
  async getList(@Request() { query }: { query: _Workflow.Query }): Promise<_Workflow.QueryResult> {
    await sleep(1000);
    return this.workflowService.findAll(query);
  }

  @Get(":id")
  async getItem(@Param() param: { id: string }): Promise<_Workflow.IWorkflow> {
    return this.workflowService.findOne(param.id);
  }

  @Post()
  async createItem(@Request() { user, body }: { user: _App.IAuthUser; body: _Workflow.IWorkflow }): Promise<_Workflow.CreateResult> {
    return this.workflowService.createItem(user.id, body);
  }

  @Put(":id")
  async updateItem(
    @Request() { user, body, params }: { user: _App.IAuthUser; body: _Workflow.IWorkflow; params: { id: string } },
  ): Promise<_Workflow.UpdateResult> {
    return this.workflowService.updateItem(user.id, params.id, body);
  }

  @Delete(":id")
  async deleteItem(@Param() param: { id: string }): Promise<void> {
    return this.workflowService.deleteItem(param.id);
  }

  @Delete()
  async batchDelete(@Body() { ids }: { ids: string[] }): Promise<void> {
    await sleep(1000);
    return this.workflowService.batchDelete(ids);
  }
}
