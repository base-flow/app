import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import Lang from "@/assets/Lang";
import EntityCardList from "@/modules/entity/views/EntityCardList";
import { useConfig } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/platform/node/$runtime")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.number().optional(),
    keyword: z.string().optional(),
    dir: z.string().optional(),
  }),
});

function RouteComponent() {
  const runtime = Route.useParams().runtime as _App.Runtime;
  const search = Route.useSearch();
  const { config } = useConfig();
  return (
    <EntityCardList
      entity="node"
      rootDir={config.dirs.node[runtime]}
      rootName={Lang.entityDirName[`node.${runtime}`]}
      query={{ ...search, dir: search.dir || config.dirs.node[runtime] }}
    />
  );
}
