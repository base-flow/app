import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/workflow/$workflowId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  return <div>dd</div>;
}
