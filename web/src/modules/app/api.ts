import { AUTH_TOKEN_KEY } from "@/utils/const";
import request from "@/utils/request";

const GuestUser: App.IAuthUser = { id: "", username: "" };

export const AppAPI = {
  login(args: App.AuthLogin): Promise<void> {
    return request.put<{ token: string }>("/api/auth", args).then((res) => {
      localStorage.setItem(AUTH_TOKEN_KEY, res.data.token);
    });
  },
  logout(): Promise<void> {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return Promise.resolve();
  },
  getAuth(): Promise<App.IAuthUser> {
    return request
      .get<App.IAuthUser>("/api/auth", { headers: { Quiet: 1 } })
      .then((res) => res.data)
      .catch(() => GuestUser);
  },
};
