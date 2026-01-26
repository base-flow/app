import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/modules/app/store";
import PlatformMenu from "@/modules/platform/components/PlatformMenu";
import { ConfigContext, PermissionsContext } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/platform/workflow")({
  component: RouteComponent,
});

function RouteComponent() {
  const [getPermissions, auth, config] = useAppStore(useShallow(({ getPermissions, auth, config }) => [getPermissions, auth, config]));
  const permissions = useMemo(() => getPermissions(), [getPermissions]);

  return (
    <PermissionsContext.Provider value={{ auth, permissions, getPermissionsInProject: getPermissions }}>
      <ConfigContext.Provider value={{ config: config! }}>
        <aside className="g-col-side">
          <PlatformMenu />
        </aside>
        <main className="g-col-panel">
          <Outlet />
        </main>
      </ConfigContext.Provider>
    </PermissionsContext.Provider>
  );
}
