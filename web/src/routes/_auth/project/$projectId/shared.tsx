import { createFileRoute } from "@tanstack/react-router";
import SharedList from "@/modules/shared/views/SharedList";
import { useProject } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/project/$projectId/shared")({
  component: RouteComponent,
});

function RouteComponent() {
  const { project } = useProject();
  return <SharedList spaceName={project.name} query={{ spaceType: "project", spaceId: project.id }} />;
}
