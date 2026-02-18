import { createFileRoute } from "@tanstack/react-router";
import WorkflowItem from "@/modules/workflow/views/WorkflowItem";

export const Route = createFileRoute("/_auth/workflow/$workflowId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  return <WorkflowItem id={params.workflowId} />;
}
