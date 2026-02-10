import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Result, Skeleton } from "antd";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import LoadingMask from "@/components/LoadingMask";
import Nameplate from "@/components/Nameplate";
import { useAppStore } from "@/modules/app/store";
import { PersonalAPI } from "@/modules/personal/api";
import PersonalMenu from "@/modules/personal/views/PersonalMenu";
import { PermissionsContext, PersonalContext } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/personal/$personalId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const [getPermissions, auth] = useAppStore(useShallow(({ getPermissions, auth }) => [getPermissions, auth]));
  const permissions = useMemo(() => getPermissions(), [getPermissions]);
  const personalQuery = useQuery(PersonalAPI.queryItem(params.personalId));
  const personal = personalQuery.data;
  const [currentPath, setCurrentPath] = useState("");
  const permissionsContextValue = useMemo(
    () => ({ auth, permissions, getPermissionsInProject: getPermissions }),
    [auth, getPermissions, permissions],
  );
  const personalContextValue = useMemo(() => ({ personal: personal!, isOwner: personal?.id === auth.id, setCurrentPath }), [personal, auth]);

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

  return (
    <PermissionsContext.Provider value={permissionsContextValue}>
      <PersonalContext value={personalContextValue}>
        <aside>
          <div>
            <Nameplate type="personal" title={personal.nickname} remark={personal.username} logo={personal.avatar} />
            <PersonalMenu currentPath={currentPath} />
          </div>
        </aside>
        <main className="g-col-paper">
          <LoadingMask show={personalQuery.isFetching} />
          <Outlet />
        </main>
      </PersonalContext>
    </PermissionsContext.Provider>
  );
}
