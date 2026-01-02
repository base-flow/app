import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useCallback, useLayoutEffect } from "react";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import LoginForm from "~/_core/components/LoginForm";
import { useCoreStore } from "~/_core/store";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginComponent,
});

function LoginComponent() {
  const router = useRouter();
  const [auth, login] = useCoreStore(useShallow(({ auth, login }) => [auth, login]));
  const search = Route.useSearch();

  const onLogin = useCallback(
    (data: Core.AuthLogin) => {
      login(data).then(() => router.invalidate());
    },
    [login, router],
  );

  useLayoutEffect(() => {
    if (auth.username) {
      router.history.push(search.redirect || "/dashboard");
    }
  }, [auth.username, router.history, search.redirect]);

  return <LoginForm auth={auth} onSubmit={onLogin} />;
}
