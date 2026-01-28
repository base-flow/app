import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/personal/$personalId/favorite")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/personal/$personalId/favorite"!</div>;
}
