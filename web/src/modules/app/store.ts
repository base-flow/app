import { create } from "zustand";
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
    await AppAPI.login(args);
    location.href = args.redirect;
  },
  logout: async () => {
    await AppAPI.logout();
    location.reload();
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
