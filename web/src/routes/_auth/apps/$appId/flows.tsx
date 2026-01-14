import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import FlowList from "@/modules/flow/components/FlowList";

export const Route = createFileRoute("/_auth/apps/$appId/flows")({
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
  return <FlowList query={{ ...search, ...params }} />;
}
