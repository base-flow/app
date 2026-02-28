import { DslTools, type GraphData } from "@baseflow/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Result, Skeleton } from "antd";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/modules/app/store";
import { EntityAPI } from "@/modules/entity/api";
import { WorkflowAPI } from "@/modules/workflow/api";
import WorkflowItem from "@/modules/workflow/views/WorkflowItem";
import { ConfigContext, PermissionsContext } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/workflow/$workflowId")({
  component: RouteComponent,
});

function RouteComponent() {
  const [auth, config] = useAppStore(useShallow(({ auth, config }) => [auth, config]));
  const params = Route.useParams();
  const workflowEntityQuery = useQuery(EntityAPI.queryItem(params.workflowId));
  const workflowDetailQuery = useQuery(WorkflowAPI.queryItem(params.workflowId));
  const workflowEntity = workflowEntityQuery.data as _Workflow.IWorkflow;
  const workflowDetail = workflowDetailQuery.data;

  if (workflowEntityQuery.isError || workflowDetailQuery.isError) {
    return (
      <section>
        <Result status="warning" title={workflowEntityQuery.error?.message || workflowDetailQuery.error?.message || "错误"} />
      </section>
    );
  }

  if (!workflowEntity || !workflowDetail) {
    return (
      <section>
        <Skeleton className="loading" active />
      </section>
    );
  }

  let graphData: GraphData<any>;
  try {
    graphData = DslTools.jsonToGraph(JSON.parse(workflowDetail.content));
  } catch (e: any) {
    throw new Error(`DSL解析出错：${e.message}`);
  }

  return (
    <ConfigContext.Provider value={{ config: config! }}>
      <WorkflowItem item={{ ...workflowEntity, ...workflowDetail }} graphData={graphData} />
    </ConfigContext.Provider>
  );
}
