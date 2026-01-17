import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAppStore } from "@/modules/app/store";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ location }) => {
    const curAuth = useAppStore.getState().auth;
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
