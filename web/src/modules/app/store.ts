import { create } from "zustand";
import { logined, logouted } from "@/utils/tools";
import { AppAPI } from "./api";

export interface AppState {
  auth: App.IAuthUser;
  roles: App.IRoles;
  login: (args: App.AuthLogin) => Promise<void>;
  logout: () => Promise<void>;
  authCheck: () => Promise<void>;
}

let Roles: App.IRoles | undefined;

export const useAppStore = create<AppState>((set, get) => ({
  auth: { id: "", username: "" },
  roles: { app: {}, node: {} },
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
        if (!Roles) {
          Roles = await AppAPI.getRoles();
        }
        set((state) => ({ ...state, auth: curAuth, roles: Roles }));
      }
    }
  },
}));
