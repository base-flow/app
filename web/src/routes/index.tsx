import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAppStore } from "@/modules/app/store";

export const Route = createFileRoute("/")({
  beforeLoad: ({ location }) => {
    const curAuth = useAppStore.getState().auth;
    if (!curAuth.id) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    } else {
      throw redirect({ to: "/personal/$personalId", params: { personalId: curAuth.username } });
    }
  },
});
