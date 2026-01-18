import { create } from "zustand";
import { logined, logouted } from "@/utils/tools";
import { AppAPI, GuestUser } from "./api";

export interface AppState {
  auth: App.IAuthUser;
  sysRolesConfg?: App.SysRolesConfg;
  appRolesConfg?: App.AppRolesConfg;
  resourceRoles: App.ResourceRoles;
  sysPermissions?: App.IPermissions;
  login: (args: App.AuthLogin) => Promise<void>;
  logout: () => Promise<void>;
  authCheck: () => Promise<void>;
  getPermissions: (appId?: string) => App.IPermissions;
}

export const useAppStore = create<AppState>((set, get) => ({
  auth: GuestUser,
  resourceRoles: { app: {} },
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
        const { sysRolesConfg, appRolesConfg, resourceRoles } = await AppAPI.getPermissions();
        const sysPermissions = curAuth.roles.reduce((obj, role) => {
          Object.assign(obj, sysRolesConfg[role]);
          return obj;
        }, {} as App.IPermissions);
        set((state) => ({ ...state, auth: curAuth, sysRolesConfg, appRolesConfg, resourceRoles, sysPermissions }));
      }
    }
  },
  getPermissions: (appId?: string): App.IPermissions => {
    const state = get();
    const { sysPermissions = {}, resourceRoles, appRolesConfg } = state;
    if (appId && resourceRoles && appRolesConfg) {
      const appRole = resourceRoles.app[appId];
      if (appRole) {
        const appPermissions = appRolesConfg[appRole];
        return { ...appPermissions, ...sysPermissions };
      }
    }
    return sysPermissions;
  },
}));
