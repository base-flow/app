import { createFileRoute, Outlet } from "@tanstack/react-router";
import SideMenu from "@/modules/flowNode/components/SideMenu";

export const Route = createFileRoute("/_auth/nodes")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <aside className="g-col-side">
        <SideMenu />
      </aside>
      <main className="g-col-panel">
        <Outlet />
      </main>
    </>
  );
}
