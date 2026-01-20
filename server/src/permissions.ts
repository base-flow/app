export const SystemRoleConfg: _Permission.SystemRoleConfg = {
  Admin: {
    project_list: "all",
    project_view: "all",
    project_create: "all",
    project_edit: "all",
    project_delete: "all",
    project_assignUsers: "all",
    flow_list: "all",
    flow_view: "all",
    flow_edit: "all",
    flow_create: "all",
    flow_delete: "all",
    node_list: "all",
    node_view: "all",
    node_edit: "all",
    node_create: "all",
    node_delete: "all",
  },
  Member: {
    project_list: "involved",
    project_create: "all",
    node_list: "all",
    node_create: "all",
    node_edit: "owner",
    node_delete: "owner",
  },
  Guest: {},
};

export const ProjectRoleConfg: _Permission.ProjectRoleConfg = {
  Owner: {
    project_view: "all",
    project_edit: "all",
    project_delete: "all",
    project_assignUsers: "admin",
    flow_list: "all",
    flow_view: "all",
    flow_edit: "all",
    flow_create: "all",
    flow_delete: "all",
  },
  Admin: {
    project_view: "all",
    project_assignUsers: "dev",
    flow_list: "all",
    flow_view: "all",
    flow_edit: "all",
    flow_create: "all",
    flow_delete: "all",
  },
  Developer: {
    project_view: "all",
    flow_list: "all",
    flow_view: "all",
    flow_edit: "all",
    flow_create: "all",
    flow_delete: "all",
  },
  Tester: {
    project_view: "all",
    flow_list: "all",
    flow_view: "all",
  },
  Member: {
    project_view: "all",
    flow_list: "all",
    flow_view: "blockingConfigs",
  },
};
export const MyProjectRoles: _Permission.MyProjectRoles = {
  "3": "Owner",
  "5": "Admin",
};
export function getPermissions(user: _App.IAuthUser): _Permission.IPermissions {
  const systemPermissions = user.roles.reduce((obj, role) => {
    Object.assign(obj, SystemRoleConfg[role]);
    return obj;
  }, {} as _Permission.IPermissions);
  return systemPermissions;
}
