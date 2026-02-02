import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import EntityList from "@/modules/entity/views/EntityList";
import { usePersonal } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/personal/$personalId/shared")({
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const { personal } = usePersonal();
  return <EntityList title="我的分享" />;
}
