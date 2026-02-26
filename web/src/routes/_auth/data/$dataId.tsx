import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Result, Skeleton } from "antd";
import { DataAPI } from "@/modules/data/api";
import DataItem from "@/modules/data/views/DataItem";
import { EntityAPI } from "@/modules/entity/api";

export const Route = createFileRoute("/_auth/data/$dataId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const dataEntityQuery = useQuery(EntityAPI.queryItem(params.dataId));
  const dataDetailQuery = useQuery(DataAPI.queryItem(params.dataId));
  const dataEntity = dataEntityQuery.data as _Data.IData;
  const dataDetail = dataDetailQuery.data;

  if (dataEntityQuery.isError || dataDetailQuery.isError) {
    return (
      <section>
        <Result status="warning" title={dataEntityQuery.error?.message || dataDetailQuery.error?.message || "错误"} />
      </section>
    );
  }

  if (!dataEntity || !dataDetail) {
    return (
      <section>
        <Skeleton className="loading" active />
      </section>
    );
  }

  return <DataItem item={{ ...dataEntity, ...dataDetail }} />;
}
