import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/project/$projectId/node")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/project/$projectId/node"!</div>;
}
