import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/shared/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/shared/"!</div>;
}
