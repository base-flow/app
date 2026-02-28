import { create } from "zustand";
import { logined, logouted } from "@/utils/tools";
import { AppAPI, GuestUser } from "./api";

export interface AppState {
  config?: _App.Config;
  auth: _App.AuthUser;
  nickname: string;
  myProjects: _App.MyProjects;
  login: (args: _App.AuthLogin) => Promise<void>;
  logout: () => Promise<void>;
  authCheck: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  auth: GuestUser,
  nickname: "guest",
  myProjects: {},
  login: async (args: _App.AuthLogin) => {
    const { token, ...auth } = await AppAPI.login(args);
    logined(token, auth, args.redirect);
  },
  logout: async () => {
    await AppAPI.logout();
    logouted();
  },
  authCheck: async () => {
    const curAuth = await AppAPI.getAuth();
    const auth = get().auth;
    if (curAuth.id !== auth.id) {
      if (auth.id) {
        location.reload();
        throw new Error("Refresh...");
      } else {
        const [config, { nickname, myProjects }] = await Promise.all([AppAPI.getConfig(), AppAPI.getProfile()]);
        set((state) => ({ ...state, auth: curAuth, config, nickname, myProjects }));
      }
    }
  },
}));
