import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import EntityList from "@/modules/entity/views/EntityList";
import { useProject } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/project/$projectId/workflow")({
  validateSearch: z.object({
    page: z.number().optional(),
    keyword: z.string().optional(),
    dir: z.string().optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const { project } = useProject();
  return <EntityList title="流程" query={{ ...search, type: "workflow", dir: search.dir || project.dir }} />;
}
