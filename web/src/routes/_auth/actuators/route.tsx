import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Result } from "antd";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/modules/app/store";
import NodeMenu from "@/modules/flowNode/components/NodeMenu";
import { PermissionsContext } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/actuators")({
  component: RouteComponent,
});

function RouteComponent() {
  const [getPermissions, auth] = useAppStore(useShallow(({ getPermissions, auth }) => [getPermissions, auth]));
  const permissions = useMemo(() => getPermissions(), [getPermissions]);

  if (!permissions.node_list) {
    return (
      <section>
        <Result status="403" subTitle="您没有访问权限..." />
      </section>
    );
  }

  return (
    <PermissionsContext.Provider value={{ auth, permissions, getPermissionsInApp: getPermissions }}>
      <aside className="g-col-side">
        <NodeMenu type="actuator" />
      </aside>
      <main className="g-col-panel">
        <Outlet />
      </main>
    </PermissionsContext.Provider>
  );
}
