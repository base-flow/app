import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Result, Skeleton } from "antd";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import LoadingMask from "@/components/LoadingMask";
import { useAppStore } from "@/modules/app/store";
import { ProjectAPI } from "@/modules/project/api";
import ProjectMenu from "@/modules/project/components/ProjectMenu";
import { PermissionsContext, ProjectContext } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/project/$projectId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const [getPermissions, auth] = useAppStore(useShallow(({ getPermissions, auth }) => [getPermissions, auth]));
  const permissions = useMemo(() => getPermissions(params.projectId), [params.projectId, getPermissions]);
  const projectQuery = useQuery(ProjectAPI.queryItem(params.projectId));
  const project = projectQuery.data;

  if (!permissions.project_view || !permissions.workflow_list) {
    return (
      <section>
        <Result status="403" subTitle="您没有访问权限..." />
      </section>
    );
  }

  if (projectQuery.isError) {
    return (
      <section>
        <Result status="error" subTitle={projectQuery.error?.message || "错误"} />
      </section>
    );
  }

  if (!project) {
    return (
      <section>
        <Skeleton className="loading" active />
      </section>
    );
  }

  return (
    <PermissionsContext.Provider value={{ auth, permissions, getPermissionsInProject: getPermissions }}>
      <ProjectContext value={{ project }}>
        <aside>
          <ProjectMenu />
        </aside>
        <main className="g-col-paper">
          <LoadingMask show={projectQuery.isFetching} />
          <Outlet />
        </main>
      </ProjectContext>
    </PermissionsContext.Provider>
  );
}
