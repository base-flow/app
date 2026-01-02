import { create } from "zustand";
import { StageAPI } from "./api";

export interface StageState {
  auth: Stage.IAuthUser;
  login: (args: Stage.AuthLogin) => Promise<void>;
  logout: () => Promise<void>;
  authCheck: () => Promise<void>;
}

export const useStageStore = create<StageState>((set, get) => ({
  auth: { id: "", username: "" },
  login: async (args: Stage.AuthLogin) => {
    await StageAPI.login(args);
    location.reload();
  },
  logout: async () => {
    await StageAPI.logout();
    location.reload();
  },
  authCheck: async () => {
    const curAuth = await StageAPI.getAuth();
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
