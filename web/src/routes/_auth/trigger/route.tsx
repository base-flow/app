import { createFileRoute, Outlet } from "@tanstack/react-router";
import SideMenu from "@/modules/node/components/NodeMenu";

export const Route = createFileRoute("/_auth/trigger")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <aside className="g-col-side">
        <SideMenu type="trigger" />
      </aside>
      <main className="g-col-panel">
        <Outlet />
      </main>
    </>
  );
}
