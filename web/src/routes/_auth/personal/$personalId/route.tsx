import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Result, Skeleton } from "antd";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import LoadingMask from "@/components/LoadingMask";
import { MY_PERSONAL_ID } from "@/const";
import { useAppStore } from "@/modules/app/store";
import { PersonalAPI } from "@/modules/personal/api";
import PersonalMenu from "@/modules/personal/components/PersonalMenu";
import { PermissionsContext, PersonalContext } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/personal/$personalId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const [getPermissions, auth] = useAppStore(useShallow(({ getPermissions, auth }) => [getPermissions, auth]));
  const personalId = params.personalId === MY_PERSONAL_ID ? auth.directory : params.personalId;
  const permissions = useMemo(() => getPermissions(), [getPermissions]);
  const personalQuery = useQuery(PersonalAPI.queryItem(personalId));
  const personal = personalQuery.data;

  if (personalQuery.isError) {
    return (
      <section>
        <Result status="error" subTitle={personalQuery.error?.message || "错误"} />
      </section>
    );
  }

  if (!personal) {
    return (
      <section>
        <Skeleton className="loading" active />
      </section>
    );
  }

  if (!(permissions.personal_view === "all" || (permissions.personal_view === "owner" && personal.createBy === auth.id))) {
    return (
      <section>
        <Result status="403" subTitle="您没有访问权限..." />
      </section>
    );
  }

  return (
    <PermissionsContext.Provider value={{ auth, permissions, getPermissionsInProject: getPermissions }}>
      <PersonalContext value={{ personal }}>
        <aside>
          <PersonalMenu personalId={params.personalId} />
        </aside>
        <main className="g-col-paper">
          <LoadingMask show={personalQuery.isFetching} />
          <Outlet />
        </main>
      </PersonalContext>
    </PermissionsContext.Provider>
  );
}
