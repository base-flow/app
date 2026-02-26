import { Controller, Get, NotFoundException, Param, Post, Put, Query, Request } from "@nestjs/common";
import { EntityMap } from "@/data";
import { sleep } from "@/utils";

@Controller("workflow")
export class WorkflowController {
  @Get(":id")
  async getItem(@Param() param: { id: string }): Promise<_Workflow.IWorkflowDetail> {
    await sleep(1000);
    const entity = EntityMap[param.id] as _Workflow.IWorkflow;
    if (!entity) {
      throw new NotFoundException();
    }
    return {
      content:
        '{"layout":"dagre","sources":{"@baseflow-nodes/flow":"@baseflow-nodes/flow@1.0.0","@baseflow-nodes/start":"@baseflow-nodes/start@1.0.0","@baseflow-nodes/end":"@baseflow-nodes/end@1.0.0"},"nodes":{"id":"flow","tag":"@baseflow-nodes/flow","meta":{"name":"流程","width":250,"height":68},"props":{},"children":[{"id":"start","tag":"@baseflow-nodes/start","meta":{"name":"流程开始","width":250,"height":68},"props":{}},{"id":"end","tag":"@baseflow-nodes/end","meta":{"name":"流程结束","width":250,"height":68},"props":{}}]},"triggers":[],"extend":{}}',
      commitId: "123e4567-e89b-12d3-a456-426614174000",
      released: false,
    };
  }
}
