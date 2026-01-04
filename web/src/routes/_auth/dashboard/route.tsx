import { createFileRoute, Outlet } from "@tanstack/react-router";
// import DashboardMenu from '@/modules/dashboard/components/DashboardMenu';

export const Route = createFileRoute("/_auth/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <aside>
        <div>Menu</div>
      </aside>
      <main className="g-col-paper">
        <Outlet />
      </main>
    </>
  );
}
