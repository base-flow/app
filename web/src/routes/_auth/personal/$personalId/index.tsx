import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import EntityList from "@/modules/entity/views/EntityList";
import { usePersonal } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/personal/$personalId/")({
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
  const { personal, isMine, setCurrentPath } = usePersonal();
  const space = useMemo(() => ({ id: personal.id, name: personal.nickname, type: "personal" as "personal" | "project" }), [personal]);
  return (
    <EntityList
      isMine={isMine}
      space={space}
      rootName="我的文档"
      rootDir={personal.dir}
      setCurrentPath={setCurrentPath}
      query={{ ...search, dir: search.dir || (isMine ? personal.dir : personal.publicDir) }}
    />
  );
}
