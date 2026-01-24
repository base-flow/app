import request from "@/utils/request";

export const GuestUser: _App.IAuthUser = { id: "", username: "guest", nickname: "guest", roles: ["Guest"] };

export const AppAPI = {
  login(args: _App.AuthLogin): Promise<{ token: string }> {
    return request.put("/api/auth", args).then((res) => res.data);
  },
  logout(): Promise<void> {
    return Promise.resolve();
  },
  getAuth(): Promise<_App.IAuthUser> {
    return request
      .get("/api/auth", { headers: { Quiet: 1 } })
      .then((res) => res.data)
      .catch(() => GuestUser);
  },
  getPermissions(): Promise<_Permission.QueryPermissionsResult> {
    return request.get("/api/auth/permissions").then((res) => res.data);
  },
  getFavorites(): Promise<_App.FavoriteList> {
    return Promise.resolve({ node: ["2", "3"] });
  },
  addToFavorites(type: "node", id: string): Promise<void> {
    return Promise.resolve();
  },
  removeFromFavorites(type: "node", id: string): Promise<void> {
    return Promise.resolve();
  },
};
