import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Result } from "antd";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/modules/app/store";
import AppMenu from "@/modules/flowApp/components/AppMenu";

export const Route = createFileRoute("/_auth/apps/$appId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const [getPermissions] = useAppStore(useShallow(({ getPermissions }) => [getPermissions]));
  const permissions = useMemo(() => getPermissions(params.appId), [params.appId, getPermissions]);

  if (!permissions.app_view) {
    return (
      <section>
        <Result status="403" title="您没有权限访问..." />
      </section>
    );
  }
  return (
    <>
      <aside>
        <AppMenu appId={params.appId} permissions={permissions} />
      </aside>
      <main className="g-col-paper">
        <Outlet />
      </main>
    </>
  );
}
