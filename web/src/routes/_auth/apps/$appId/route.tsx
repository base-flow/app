import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Result, Skeleton } from "antd";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import LoadingMask from "@/components/LoadingMask";
import { useAppStore } from "@/modules/app/store";
import { FlowAppAPI } from "@/modules/flowApp/api";
import AppMenu from "@/modules/flowApp/components/AppMenu";
import { FlowAppDataContext, PermissionsContext } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/apps/$appId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const [getPermissions, auth] = useAppStore(useShallow(({ getPermissions, auth }) => [getPermissions, auth]));
  const permissions = useMemo(() => getPermissions(params.appId), [params.appId, getPermissions]);
  const app = useQuery(FlowAppAPI.queryItem(params.appId));
  const appData = app.data;

  if (!permissions.app_view || !permissions.flow_list) {
    return (
      <section>
        <Result status="403" title="您没有权限访问..." />
      </section>
    );
  }

  if (app.isError) {
    return (
      <section>
        <Result status="error" subTitle={app.error?.message || "错误"} />
      </section>
    );
  }

  if (!appData) {
    return (
      <section>
        <Skeleton className="loading" active />
      </section>
    );
  }

  return (
    <PermissionsContext.Provider value={{ auth, permissions, getPermissionsInApp: getPermissions }}>
      <FlowAppDataContext value={{ appData: appData }}>
        <aside>
          <AppMenu />
        </aside>
        <main className="g-col-paper">
          <LoadingMask show={app.isFetching} />

          <Outlet />
        </main>
      </FlowAppDataContext>
    </PermissionsContext.Provider>
  );
}
