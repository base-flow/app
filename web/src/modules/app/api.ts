import request from "@/utils/request";

const GuestUser: App.IAuthUser = { id: "", username: "" };

export const AppAPI = {
  rolesQueryKey: "AppRoles",
  login(args: App.AuthLogin): Promise<{ token: string }> {
    return request.put("/api/auth", args).then((res) => res.data);
  },
  logout(): Promise<void> {
    return Promise.resolve();
  },
  getAuth(): Promise<App.IAuthUser> {
    return request
      .get("/api/auth", { headers: { Quiet: 1 } })
      .then((res) => res.data)
      .catch(() => GuestUser);
  },
  getRoles(): Promise<App.IRoles> {
    return request
      .get("/api/auth/role")
      .then((res) => res.data)
      .catch(() => ({}));
  },
};
