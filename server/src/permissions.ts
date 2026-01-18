export const SysRolesConfg: { [key in App.SysRole]: { [key in keyof App.Actions]?: App.Actions[key] } } = {
  Admin: {
    app_list: "all",
    app_view: "all",
    app_create: "all",
    app_edit: "all",
    app_delete: "all",
    app_assignUsers: "all",
    flow_list: "all",
    flow_view: "all",
    flow_edit: "all",
    flow_create: "all",
    flow_delete: "all",
  },
  Member: {
    app_list: "involved",
    app_create: "all",
    // app_view: "all",
    // app_edit: "all",
    // app_delete: "all",
    // app_assignUsers: "all",
    // flow_list: "all",
    // flow_view: "all",
    // flow_edit: "all",
    // flow_create: "all",
    // flow_delete: "all",
  },
  Guest: {},
};

export const AppRolesConfg: { [key in App.AppRole]: { [key in keyof App.Actions]?: App.Actions[key] } } = {
  Owner: {
    app_view: "all",
    app_edit: "all",
    app_delete: "all",
    app_assignUsers: "admin",
    flow_list: "all",
    flow_view: "all",
    flow_edit: "all",
    flow_create: "all",
    flow_delete: "all",
  },
  Admin: {
    app_view: "all",
    app_assignUsers: "dev",
    flow_list: "all",
    flow_view: "all",
    flow_edit: "all",
    flow_create: "all",
    flow_delete: "all",
  },
  Developer: {
    app_view: "all",
    flow_list: "all",
    flow_view: "all",
    flow_edit: "all",
    flow_create: "all",
    flow_delete: "all",
  },
  Tester: {
    app_view: "all",
    flow_list: "all",
    flow_view: "all",
  },
  Member: {
    app_view: "all",
    flow_list: "all",
    flow_view: "blockingConfigs",
  },
};
export const ResourceRoles: App.ResourceRoles = {
  app: {
    "3": "Owner",
    "5": "Member",
  },
};
export function getPermissions(user: App.IAuthUser): App.IPermissions {
  const sysPermissions = user.roles.reduce((obj, role) => {
    Object.assign(obj, SysRolesConfg[role]);
    return obj;
  }, {} as App.IPermissions);
  return sysPermissions;
}
