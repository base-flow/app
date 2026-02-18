import { DslTools, type GraphData } from "@baseflow/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Result, Skeleton } from "antd";
import { WorkflowAPI } from "@/modules/workflow/api";
import WorkflowItem from "@/modules/workflow/views/WorkflowItem";

export const Route = createFileRoute("/_auth/workflow/$workflowId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const workflowQuery = useQuery(WorkflowAPI.queryItem(params.workflowId));
  const workflowData = workflowQuery.data;

  if (workflowQuery.isError) {
    return (
      <section>
        <Result status="warning" title={workflowQuery.error?.message || "错误"} />
      </section>
    );
  }

  if (!workflowData) {
    return (
      <section>
        <Skeleton className="loading" active />
      </section>
    );
  }

  let graphData: GraphData<any>;
  try {
    graphData = DslTools.jsonToGraph(JSON.parse(workflowData.content));
  } catch (e: any) {
    throw new Error(`DSL解析出错：${e.message}`);
  }

  return <WorkflowItem item={workflowData} graphData={graphData} />;
}
