import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import EntityCardList from "@/modules/entity/components/EntityCardList";
import { useConfig } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/platform/workflow2")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.number().optional(),
    keyword: z.string().optional(),
    dir: z.string().optional(),
  }),
});

function RouteComponent() {
  const search = Route.useSearch();
  const { config } = useConfig();
  return <EntityCardList title="流程" query={{ ...search, dir: search.dir || config.dirs.workflow._ }} />;
}
