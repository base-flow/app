import { createFileRoute } from "@tanstack/react-router";
import FlowItem from "@/modules/flow/components/FlowItem";

export const Route = createFileRoute("/_auth/flow/$flowId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  return <FlowItem flowId={params.flowId} />;
}
