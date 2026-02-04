import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Result, Skeleton } from "antd";
import LoadingMask from "@/components/LoadingMask";
import Nameplate from "@/components/Nameplate";
import { SharedAPI } from "@/modules/shared/api";
import SharedContent from "@/modules/shared/views/SharedContent";
import SharedInfo from "@/modules/shared/views/SharedInfo";
import SharedSettings from "@/modules/shared/views/SharedSettings";

export const Route = createFileRoute("/_auth/shared/$sharedId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const sharedQuery = useQuery(SharedAPI.queryItem(params.sharedId));
  const shared = sharedQuery.data;

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
        <SharedSettings />
      </aside>
      <main className="g-col-paper">
        <LoadingMask show={sharedQuery.isFetching} />
        <SharedContent id={params.sharedId} title={shared.name} />
      </main>
    </>
  );
}
