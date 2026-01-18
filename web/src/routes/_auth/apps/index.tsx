import { createFileRoute } from "@tanstack/react-router";
import { Result } from "antd";
import { useMemo } from "react";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/modules/app/store";
import AppList from "@/modules/flowApp/components/AppList";

export const Route = createFileRoute("/_auth/apps/")({
  validateSearch: z.object({
    keyword: z.string().optional(),
    sorterField: z.string().optional(),
    sorterOrder: z.enum(["ascend", "descend"]).optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const [getPermissions] = useAppStore(useShallow(({ getPermissions }) => [getPermissions]));
  const permissions = useMemo(() => getPermissions(), [getPermissions]);

  if (!permissions.app_list) {
    return (
      <section>
        <Result status="403" title="您没有权限访问..." />
      </section>
    );
  }

  return <AppList query={search} permissions={permissions} />;
}
