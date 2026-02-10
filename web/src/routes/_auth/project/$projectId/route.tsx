import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Result, Skeleton } from "antd";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import LoadingMask from "@/components/LoadingMask";
import Nameplate from "@/components/Nameplate";
import { useAppStore } from "@/modules/app/store";
import { ProjectAPI } from "@/modules/project/api";
import ProjectMenu from "@/modules/project/views/ProjectMenu";
import ProjectSettings from "@/modules/project/views/ProjectSettings";
import { PermissionsContext, ProjectContext } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/project/$projectId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const [getPermissions, myProjectRoles, auth] = useAppStore(
    useShallow(({ getPermissions, myProjectRoles, auth }) => [getPermissions, myProjectRoles, auth]),
  );
  const permissions = useMemo(() => getPermissions(params.projectId), [params.projectId, getPermissions]);
  const projectQuery = useQuery(ProjectAPI.queryItem(params.projectId));
  const project = projectQuery.data;
  const [currentPath, setCurrentPath] = useState("");
  const permissionsContextValue = useMemo(
    () => ({ auth, permissions, getPermissionsInProject: getPermissions }),
    [auth, getPermissions, permissions],
  );
  const projectContextValue = useMemo(
    () => ({ project: project!, isMember: Boolean(project?.id && myProjectRoles[project.id]), setCurrentPath }),
    [project, myProjectRoles],
  );

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
    <PermissionsContext.Provider value={permissionsContextValue}>
      <ProjectContext value={projectContextValue}>
        <aside>
          <div>
            <Nameplate type="project" title={project.name} logo={project.logo} />
            <ProjectMenu currentPath={currentPath} />
          </div>
          <ProjectSettings />
        </aside>
        <main className="g-col-paper">
          <LoadingMask show={projectQuery.isFetching} />
          <Outlet />
        </main>
      </ProjectContext>
    </PermissionsContext.Provider>
  );
}
