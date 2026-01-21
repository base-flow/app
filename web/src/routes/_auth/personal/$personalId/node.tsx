import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/personal/$personalId/node")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>my nodes</div>;
}
