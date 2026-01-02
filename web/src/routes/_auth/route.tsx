import { createFileRoute, redirect } from "@tanstack/react-router";
import { useStageStore } from "@/modules/stage/store";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ location }) => {
    const curAuth = useStageStore.getState().auth;
    if (!curAuth.id) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
