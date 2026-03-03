import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Result, Skeleton } from "antd";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import LoadingMask from "@/components/LoadingMask";
import Nameplate from "@/components/Nameplate";
import { useAppStore } from "@/modules/app/store";
import { SharedAPI } from "@/modules/shared/api";
import SharedContent from "@/modules/shared/views/SharedContent";
import SharedInfo from "@/modules/shared/views/SharedInfo";
import SharedSettings from "@/modules/shared/views/SharedSettings";

export const Route = createFileRoute("/_auth/shared/$sharedId/")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.number().optional(),
    keyword: z.string().optional(),
    dir: z.string().optional(),
    type: z.enum(["directory", "workflow", "node", "data"]).optional(),
    kind: z.string().optional(),
    descendants: z.boolean().optional(),
    keepDirectories: z.boolean().optional(),
  }),
});

function RouteComponent() {
  const search = Route.useSearch();
  const params = Route.useParams();
  const sharedQuery = useQuery(SharedAPI.queryItem(params.sharedId));
  const shared = sharedQuery.data;
  const [config, auth] = useAppStore(useShallow(({ config, auth }) => [config, auth]));
  const isMine = shared?.createBy === auth.username;

  if (sharedQuery.isError) {
    return (
      <section>
        <Result status="error" subTitle={sharedQuery.error?.message || "错误"} />
      </section>
    );
  }

  if (!shared) {
    return (
      <section>
        <Skeleton className="loading" active />
      </section>
    );
  }

  return (
    <>
      <aside>
        <div>
          <Nameplate type={shared.spaceType} title={shared.spaceName} logo={shared.spaceLogo} remark={shared.spaceRemark} />
          <SharedInfo info={shared} />
        </div>
        {isMine && <SharedSettings shared={shared} />}
      </aside>
      <main className="g-col-paper">
        <LoadingMask show={sharedQuery.isFetching} />
        <SharedContent shared={shared} query={search} isMine={isMine} sharedContentMax={config!.sharedContentMax} />
      </main>
    </>
  );
}
