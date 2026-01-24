import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import EntityList from "@/modules/entity/components/EntityList";
import { usePersonal } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/personal/$personalId/")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.number().optional(),
    keyword: z.string().optional(),
  }),
});

function RouteComponent() {
  const search = Route.useSearch();
  const { personal } = usePersonal();
  return <EntityList scope="personal" query={{ ...search, dir: personal.dir }} />;
}
