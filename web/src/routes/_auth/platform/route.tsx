import { createFileRoute, Outlet } from "@tanstack/react-router";
import PlatformMenu from "@/modules/platform/views/PlatformMenu";

export const Route = createFileRoute("/_auth/platform")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <aside className="g-col-side">
        <PlatformMenu />
      </aside>
      <main className="g-col-panel">
        <Outlet />
      </main>
    </>
  );
}
