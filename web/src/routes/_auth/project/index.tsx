import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import ProjectList from "@/modules/project/views/ProjectList";

export const Route = createFileRoute("/_auth/project/")({
  validateSearch: z.object({
    path: z.string().optional(),
    keyword: z.string().optional(),
    sorterField: z.string().optional(),
    sorterOrder: z.enum(["ascend", "descend"]).optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();

  return <ProjectList query={search} />;
}
