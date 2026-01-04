import { useEvent } from "@baseflow/react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import LoginForm from "@/modules/app/components/LoginForm";
import { useAppStore } from "@/modules/app/store";
import { getUserRedirect } from "@/utils/tools";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: ({ location }) => {
    const search = location.search as { redirect?: string };
    const curAuth = useAppStore.getState().auth;
    if (curAuth.id) {
      throw redirect({ to: getUserRedirect(search.redirect) });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  const search = Route.useSearch();
  const [auth, login] = useAppStore(useShallow(({ auth, login }) => [auth, login]));

  const onLogin = useEvent((data: App.AuthLogin) => {
    login({ ...data, redirect: getUserRedirect(search.redirect) });
  });
  return <LoginForm auth={auth} onSubmit={onLogin} />;
}
