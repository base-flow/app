import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import EntityList from "@/modules/entity/views/EntityList";
import { usePersonal } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/personal/$personalId/")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.number().optional(),
    keyword: z.string().optional(),
    dir: z.string().optional(),
    type: z.enum(["workflow", "node", "data"]).optional(),
  }),
});

function RouteComponent() {
  const search = Route.useSearch();
  const { personal } = usePersonal();
  return <EntityList rootName="我的文档" rootDir={personal.dir} query={{ ...search, dir: search.dir || personal.dir }} />;
}
