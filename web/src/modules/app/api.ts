import request from "@/utils/request";

export const GuestUser: _App.AuthUser = { id: "", username: "", role: "Guest", dir: "" };

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
  getProfile(): Promise<_App.MyProfile> {
    return request.get("/api/auth/profile").then((res) => res.data);
  },
};
