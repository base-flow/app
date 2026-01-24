import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/modules/app/store";
import PlatformMenu from "@/modules/platform/components/PlatformMenu";
import { PermissionsContext } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/platform")({
  component: RouteComponent,
});

function RouteComponent() {
  const [getPermissions, auth] = useAppStore(useShallow(({ getPermissions, auth }) => [getPermissions, auth]));
  const permissions = useMemo(() => getPermissions(), [getPermissions]);

  return (
    <PermissionsContext.Provider value={{ auth, permissions, getPermissionsInProject: getPermissions }}>
      <aside className="g-col-side">
        <PlatformMenu />
      </aside>
      <main className="g-col-panel">
        <Outlet />
      </main>
    </PermissionsContext.Provider>
  );
}
