import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import EntityList from "@/modules/entity/views/EntityList";
import { usePersonal } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/personal/$personalId/shared")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.number().optional(),
    keyword: z.string().optional(),
    dir: z.string().optional(),
  }),
});

function RouteComponent() {
  const search = Route.useSearch();
  const { personal } = usePersonal();
  return <EntityList title="我的分享" query={{ ...search, dir: search.dir || personal.publicDir }} />;
}
