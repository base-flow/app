import request from "@/utils/request";

export const GuestUser: _App.AuthUser = { id: "", username: "guest", nickname: "guest", roles: ["Guest"] };

export const AppAPI = {
  login(args: _App.AuthLogin): Promise<_App.AuthUser & { token: string }> {
    return request.put("/api/auth", args).then((res) => res.data);
  },
  logout(): Promise<void> {
    return Promise.resolve();
  },
  getConfig(): Promise<_App.Config> {
    return request.get("/api/config").then((res) => res.data);
  },
  getAuth(): Promise<_App.AuthUser> {
    return request
      .get("/api/auth", { headers: { Quiet: 1 } })
      .then((res) => res.data)
      .catch(() => GuestUser);
  },
  getPermissions(): Promise<_Permission.QueryPermissionsResult> {
    return request.get("/api/auth/permissions").then((res) => res.data);
  },
  // getFavorites(query: _Favorite.Query): Promise<_Entity.IEntity[]> {
  //   return request.get("/api/favorite", { params: query }).then((res) => res.data);
  // },
  // addToFavorites(type: "node", id: string): Promise<void> {
  //   return Promise.resolve();
  // },
  // removeFromFavorites(type: "node", id: string): Promise<void> {
  //   return Promise.resolve();
  // },
};
