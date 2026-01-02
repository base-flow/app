import { AUTH_TOKEN_KEY } from "@/utils/const";
import { request } from "@/utils/request";

const GuestUser: Stage.IAuthUser = { id: "", username: "" };

export const StageAPI = {
  login(args: Stage.AuthLogin): Promise<void> {
    return request.put<{ token: string }>("/api/auth", args).then(({ token }) => {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    });
  },
  logout(): Promise<void> {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return Promise.resolve();
  },
  getAuth(): Promise<Stage.IAuthUser> {
    return request.get<Stage.IAuthUser>("/api/auth", undefined, { quite: "true" }).catch(() => GuestUser);
  },
};
