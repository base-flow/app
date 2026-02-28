import { Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Request } from "@nestjs/common";
import { ProjectsMap, UsersMap } from "@/database";
import { BaseQueryDto } from "@/dto";
import { sleep } from "@/utils";
import { ProjectService } from "./project.service";

@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async getList(@Request() { user, query }: { user: _App.AuthUser; query: BaseQueryDto }): Promise<_Project.QueryResult> {
    await sleep(1000);
    const list = Object.keys(UsersMap[user.id].myProjects).map((id) => ProjectsMap[id]);
    const { page = 1 } = query;
    const pageSize = 20;
    return {
      query,
      list: list.slice((page - 1) * pageSize, page * pageSize),
      summary: { total: list.length, page, pageSize },
    };
  }

  @Get(":id")
  async getItem(@Param() param: { id: string }): Promise<_Project.IProject> {
    await sleep(1000);
    return ProjectsMap[param.id];
  }

  @Post()
  async createItem(@Request() { user, body }: { user: _App.AuthUser; body: _Project.IProject }): Promise<_Project.CreateResult> {
    await sleep(1000);
    return { id: "123" };
  }

  @Put(":id")
  async updateItem(
    @Request() { user, body, params }: { user: _App.AuthUser; body: _Project.IProject; params: { id: string } },
  ): Promise<_Project.UpdateResult> {
    await sleep(1000);
    const item = ProjectsMap[params.id];
    if (!item) {
      throw new NotFoundException();
    }
    Object.assign(item, body, { updateAt: `${Date.now()}` });
    return { id: params.id };
  }

  @Delete()
  async deleteItem(@Query() { id }: { id: string }): Promise<void> {}

  @Get(":id/member")
  async getMemberList(@Param() param: { id: string }): Promise<_Project.IMember[]> {
    await sleep(1000);
    return this.projectService.findAllMembers(param.id);
  }

  @Post(":id/member")
  async createMember(
    @Request() { user, body, params }: { user: _App.AuthUser; body: Partial<_Project.IMember>; params: { id: string } },
  ): Promise<_Project.IMember> {
    return this.projectService.createMember(params.id, body);
  }

  @Put(":id/member")
  async updateMember(
    @Request() { user, body, params }: { user: _App.AuthUser; body: Partial<_Project.IMember>; params: { id: string } },
  ): Promise<void> {
    return this.projectService.updateMember(params.id, body);
  }

  @Delete(":id/member")
  async deleteMemberItem(@Request() { user, query, params }: { user: _App.AuthUser; query: { id: string }; params: { id: string } }): Promise<void> {
    return this.projectService.deleteMemberItem(params.id, query.id);
  }
}
