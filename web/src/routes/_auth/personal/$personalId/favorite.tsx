import { createFileRoute } from "@tanstack/react-router";
import FavoriteList from "@/modules/favorite/views/FavoriteList";

export const Route = createFileRoute("/_auth/personal/$personalId/favorite")({
  component: RouteComponent,
});

function RouteComponent() {
  return <FavoriteList />;
}
