import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import Lang from "@/assets/Lang";
import EntityCardList from "@/modules/entity/views/EntityCardList";
import { useConfig } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/platform/workflow/$runtime")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.number().optional(),
    keyword: z.string().optional(),
    dir: z.string().optional(),
    kind: z.string().optional(),
    descendants: z.boolean().optional(),
    keepDirectories: z.boolean().optional(),
  }),
});

function RouteComponent() {
  const runtime = Route.useParams().runtime as _App.Runtime;
  const search = Route.useSearch();
  const { config } = useConfig();

  console.log(search);
  return (
    <EntityCardList
      entity="workflow"
      rootDir={config.platformDirs.workflow[runtime]}
      rootName={Lang.entityDirName[`workflow.${runtime}`]}
      query={{ ...search, dir: search.dir || config.platformDirs.workflow[runtime] }}
    />
  );
}
