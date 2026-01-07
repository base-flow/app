import request from "@/utils/request";

const GuestUser: App.IAuthUser = { id: "", username: "" };

export const AppAPI = {
  login(args: App.AuthLogin): Promise<{ token: string }> {
    return request.put<{ token: string }>("/api/auth", args).then((res) => res.data);
  },
  logout(): Promise<void> {
    return Promise.resolve();
  },
  getAuth(): Promise<App.IAuthUser> {
    return request
      .get<App.IAuthUser>("/api/auth", { headers: { Quiet: 1 } })
      .then((res) => res.data)
      .catch(() => GuestUser);
  },
};
