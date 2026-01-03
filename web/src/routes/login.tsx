import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useCallback, useLayoutEffect } from "react";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import LoginForm from "@/modules/stage/components/LoginForm";
import { useStageStore } from "@/modules/stage/store";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginComponent,
});

function LoginComponent() {
  const router = useRouter();
  const [auth, login] = useStageStore(useShallow(({ auth, login }) => [auth, login]));
  const search = Route.useSearch();

  const onLogin = useCallback(
    (data: Stage.AuthLogin) => {
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
