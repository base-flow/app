import { createFileRoute } from "@tanstack/react-router";
import GotSharedList from "@/modules/shared/views/GotSharedList";

export const Route = createFileRoute("/_auth/shared/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GotSharedList />;
}
