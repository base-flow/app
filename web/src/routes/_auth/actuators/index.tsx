import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import NodeList from "@/modules/flowNode/components/NodeList";

export const Route = createFileRoute("/_auth/actuators/")({
  validateSearch: z.object({
    runtime: z.enum(["server", "browser"]).default("server"),
    store: z.enum(["remote", "local"]).default("remote"),
    page: z.number().optional(),
    keyword: z.string().optional(),
    collected: z.boolean().optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const search = Route.useSearch();
  return <NodeList query={{ ...search, type: "actuator", ...params }} />;
}
