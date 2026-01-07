import { create } from "zustand";
import { logined, logouted } from "@/utils/tools";
import { AppAPI } from "./api";

export interface AppState {
  auth: App.IAuthUser;
  login: (args: App.AuthLogin) => Promise<void>;
  logout: () => Promise<void>;
  authCheck: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  auth: { id: "", username: "" },
  login: async (args: App.AuthLogin) => {
    const { token } = await AppAPI.login(args);
    logined(token, args.redirect);
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
        set((state) => ({ ...state, auth: curAuth }));
      }
    }
  },
}));
