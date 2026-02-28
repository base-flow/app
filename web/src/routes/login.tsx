import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { HomePage } from "@/const";
import { useAppStore } from "@/modules/app/store";
import LoginForm from "@/modules/app/views/LoginForm";
import { useConfig, useEvent } from "@/utils/hooks";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: ({ location }) => {
    const search = location.search as { redirect?: string };
    const curAuth = useAppStore.getState().auth;
    if (curAuth.id) {
      throw redirect({ to: !search.redirect || search.redirect === "/" ? HomePage(curAuth.id) : search.redirect });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  const search = Route.useSearch();
  const { auth, login } = useConfig();

  const onLogin = useEvent((data: _App.AuthLogin) => {
    login({ ...data, redirect: search.redirect });
  });
  return <LoginForm auth={auth} onSubmit={onLogin} />;
}
