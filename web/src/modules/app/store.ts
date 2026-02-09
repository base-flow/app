import { create } from "zustand";
import { logined, logouted } from "@/utils/tools";
import { AppAPI, GuestUser } from "./api";

export interface AppState {
  auth: _App.AuthUser;
  config?: _App.Config;
  systemRoleConfg?: _Permission.SystemRoleConfg;
  projectRoleConfg?: _Permission.ProjectRoleConfg;
  myProjectRoles: _Permission.MyProjectRoles;
  systemPermissions?: _Permission.IPermissions;
  login: (args: _App.AuthLogin) => Promise<void>;
  logout: () => Promise<void>;
  authCheck: () => Promise<void>;
  getPermissions: (projectId?: string) => _Permission.IPermissions;
}

export const useAppStore = create<AppState>((set, get) => ({
  auth: GuestUser,
  myProjectRoles: {},
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
        const [config, { systemRoleConfg, projectRoleConfg, myProjectRoles }] = await Promise.all([AppAPI.getConfig(), AppAPI.getPermissions()]);
        const systemPermissions = curAuth.roles.reduce((obj, role) => {
          Object.assign(obj, systemRoleConfg[role]);
          return obj;
        }, {} as _Permission.IPermissions);
        set((state) => ({ ...state, auth: curAuth, config, systemRoleConfg, projectRoleConfg, myProjectRoles, systemPermissions }));
      }
    }
  },
  getPermissions: (projectId?: string): _Permission.IPermissions => {
    const state = get();
    const { systemPermissions = {}, myProjectRoles, projectRoleConfg } = state;
    if (projectId && projectRoleConfg) {
      const projectRole = myProjectRoles[projectId]?.projectRole;
      if (projectRole) {
        const projectPermissions = projectRoleConfg[projectRole];
        return { ...projectPermissions, ...systemPermissions };
      }
    }
    return systemPermissions;
  },
}));
