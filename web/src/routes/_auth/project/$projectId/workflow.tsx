import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import WorkflowList from "@/modules/workflow/components/WorkflowList";

export const Route = createFileRoute("/_auth/project/$projectId/workflow")({
  validateSearch: z.object({
    page: z.number().optional(),
    keyword: z.string().optional(),
    collected: z.boolean().optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const search = Route.useSearch();
  return <WorkflowList scope="project" query={{ ...search, ...params }} />;
}
