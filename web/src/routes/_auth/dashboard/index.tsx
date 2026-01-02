import { createFileRoute } from "@tanstack/react-router";
import DashboardHome from "@/modules/dashboard/components/DashboardHome";

export const Route = createFileRoute("/_auth/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <DashboardHome />;
}
