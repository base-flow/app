import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import AppList from "@/modules/flowApp/components/AppList";

export const Route = createFileRoute("/_auth/apps/")({
  validateSearch: z.object({
    keyword: z.string().optional(),
    sorterField: z.string().optional(),
    sorterOrder: z.enum(["ascend", "descend"]).optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  return <AppList query={search} />;
}
