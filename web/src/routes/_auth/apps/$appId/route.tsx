import { createFileRoute, Outlet } from "@tanstack/react-router";
import AppMenu from "@/modules/flowApp/components/AppMenu";

export const Route = createFileRoute("/_auth/apps/$appId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  return (
    <>
      <aside>
        <AppMenu appId={params.appId} />
      </aside>
      <main className="g-col-paper">
        <Outlet />
      </main>
    </>
  );
}
