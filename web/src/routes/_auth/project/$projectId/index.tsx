import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import EntityList from "@/modules/entity/views/EntityList";
import { useProject } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/project/$projectId/")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.number().optional(),
    keyword: z.string().optional(),
    dir: z.string().optional(),
    type: z.enum(["directory", "workflow", "node", "data"]).optional(),
    kind: z.string().optional(),
    descendants: z.boolean().optional(),
    keepDirectories: z.boolean().optional(),
  }),
});

function RouteComponent() {
  const search = Route.useSearch();
  const { project, projectRole, setCurrentPath } = useProject();
  const space = useMemo(() => ({ id: project.id, name: project.name, type: "project" as "personal" | "project" }), [project]);
  return (
    <EntityList
      isMine={projectRole === "Owner" || projectRole === "Admin" || projectRole === "Developer"}
      space={space}
      rootName="项目文档"
      rootDir={project.dir}
      setCurrentPath={setCurrentPath}
      query={{ ...search, dir: search.dir || (projectRole ? project.dir : project.publicDir) }}
    />
  );
}
