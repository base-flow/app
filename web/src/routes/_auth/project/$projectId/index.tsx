import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import EntityList from "@/modules/entity/views/EntityList";
import { useProject } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/project/$projectId/")({
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
  const { project } = useProject();
  return <EntityList rootName="项目文档" rootDir={project.dir} query={{ ...search, dir: search.dir || project.dir }} />;
}
