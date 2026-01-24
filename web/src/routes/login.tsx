import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import { HomePage } from "@/const";
import LoginForm from "@/modules/app/components/LoginForm";
import { useAppStore } from "@/modules/app/store";
import { useEvent } from "@/utils/hooks";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: ({ location }) => {
    const search = location.search as { redirect?: string };
    const curAuth = useAppStore.getState().auth;
    if (curAuth.id) {
      throw redirect({ to: !search.redirect || search.redirect === "/" ? HomePage(curAuth.username) : search.redirect });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  const search = Route.useSearch();
  const [auth, login] = useAppStore(useShallow(({ auth, login }) => [auth, login]));

  const onLogin = useEvent((data: _App.AuthLogin) => {
    login({ ...data, redirect: search.redirect });
  });
  return <LoginForm auth={auth} onSubmit={onLogin} />;
}
