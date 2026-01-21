import { createFileRoute, redirect } from "@tanstack/react-router";
import { MY_PERSONAL_ID } from "@/const";
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
      throw redirect({ to: "/personal/$personalId/workflow", params: { personalId: MY_PERSONAL_ID } });
    }
  },
});
