import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import EntityList from "@/modules/entity/views/EntityList";
import { usePersonal } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/personal/$personalId/node")({
  validateSearch: z.object({
    page: z.number().optional(),
    keyword: z.string().optional(),
    dir: z.string().optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const { personal } = usePersonal();
  return <EntityList title="我的文档" query={{ ...search, type: "node", dir: search.dir || personal.dir }} />;
}
