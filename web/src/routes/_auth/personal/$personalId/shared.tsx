import { createFileRoute } from "@tanstack/react-router";
import SharedList from "@/modules/shared/views/SharedList";
import { usePersonal } from "@/utils/hooks";

export const Route = createFileRoute("/_auth/personal/$personalId/shared")({
  component: RouteComponent,
});

function RouteComponent() {
  const { personal } = usePersonal();
  return <SharedList spaceName={personal.nickname} query={{ spaceType: "personal", spaceId: personal.id }} />;
}
