import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Result, Skeleton } from "antd";
import { EntityAPI } from "@/modules/entity/api";
import { NodeAPI } from "@/modules/node/api";
import NodeItem from "@/modules/node/views/NodeItem";

export const Route = createFileRoute("/_auth/node/$nodeId")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const nodeEntityQuery = useQuery(EntityAPI.queryItem(params.nodeId));
  const nodeDetailQuery = useQuery(NodeAPI.queryItem(params.nodeId));
  const nodeEntity = nodeEntityQuery.data as _Node.INode;
  const nodeDetail = nodeDetailQuery.data;

  if (nodeEntityQuery.isError || nodeDetailQuery.isError) {
    return (
      <section>
        <Result status="warning" title={nodeEntityQuery.error?.message || nodeDetailQuery.error?.message || "错误"} />
      </section>
    );
  }

  if (!nodeEntity || !nodeDetail) {
    return (
      <section>
        <Skeleton className="loading" active />
      </section>
    );
  }

  return <NodeItem item={{ ...nodeEntity, ...nodeDetail }} />;
}
