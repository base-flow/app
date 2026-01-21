export const SystemRoleConfg: _Permission.SystemRoleConfg = {
  Admin: {
    project_list: "all",
    project_view: "all",
    project_create: "all",
    project_edit: "all",
    project_delete: "all",
    project_assignUsers: "all",
    workflow_list: "all",
    workflow_view: "all",
    workflow_edit: "all",
    workflow_create: "all",
    workflow_delete: "all",
    node_list: "all",
    node_view: "all",
    node_edit: "all",
    node_create: "all",
    node_delete: "all",
    personal_view: "all",
  },
  Member: {
    project_list: "involved",
    project_create: "all",
    node_list: "all",
    node_create: "all",
    node_edit: "owner",
    node_delete: "owner",
    personal_view: "owner",
  },
  Guest: {},
};

export const ProjectRoleConfg: _Permission.ProjectRoleConfg = {
  Owner: {
    project_view: "all",
    project_edit: "all",
    project_delete: "all",
    project_assignUsers: "admin",
    workflow_list: "all",
    workflow_view: "all",
    workflow_edit: "all",
    workflow_create: "all",
    workflow_delete: "all",
  },
  Admin: {
    project_view: "all",
    project_assignUsers: "dev",
    workflow_list: "all",
    workflow_view: "all",
    workflow_edit: "all",
    workflow_create: "all",
    workflow_delete: "all",
  },
  Developer: {
    project_view: "all",
    workflow_list: "all",
    workflow_view: "all",
    workflow_edit: "all",
    workflow_create: "all",
    workflow_delete: "all",
  },
  Tester: {
    project_view: "all",
    workflow_list: "all",
    workflow_view: "all",
  },
  Member: {
    project_view: "all",
    workflow_list: "all",
    workflow_view: "blockingConfigs",
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
