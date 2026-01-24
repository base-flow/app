import { createFileRoute } from "@tanstack/react-router";
import { Result } from "antd";
import { useMemo } from "react";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/modules/app/store";
import ProjectList from "@/modules/project/components/ProjectList";
import { PermissionsContext } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/project/")({
  validateSearch: z.object({
    path: z.string().optional(),
    keyword: z.string().optional(),
    sorterField: z.string().optional(),
    sorterOrder: z.enum(["ascend", "descend"]).optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const [getPermissions, auth] = useAppStore(useShallow(({ getPermissions, auth }) => [getPermissions, auth]));
  const permissions = useMemo(() => getPermissions(), [getPermissions]);

  if (!permissions.project_list) {
    return (
      <section>
        <Result status="403" subTitle="您没有访问权限..." />
      </section>
    );
  }

  return (
    <PermissionsContext.Provider value={{ auth, permissions, getPermissionsInProject: getPermissions }}>
      <ProjectList query={search} />
    </PermissionsContext.Provider>
  );
}
