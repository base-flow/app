import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import EntityCardList from "@/modules/entity/views/EntityCardList";
import { useConfig } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/platform/workflow/$runtime")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.number().optional(),
    keyword: z.string().optional(),
    dir: z.string().optional(),
  }),
});

function RouteComponent() {
  const { runtime } = Route.useParams();
  const search = Route.useSearch();
  const { config } = useConfig();
  return <EntityCardList title="流程" query={{ ...search, dir: search.dir || config.dirs.workflow[runtime as _App.Runtime] }} />;
}
