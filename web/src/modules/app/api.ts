import request from "@/utils/request";

export const GuestUser: App.IAuthUser = { id: "", username: "", nickname: "", roles: ["Guest"] };

export const AppAPI = {
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
  getPermissions(): Promise<App.IQueryPermissionsResult> {
    return request.get("/api/auth/permissions").then((res) => res.data);
  },
};
