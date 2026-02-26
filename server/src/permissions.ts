import { ProjectsMap } from "./database";
export const SystemRoleConfg: _Permission.SystemRoleConfg = {
  Admin: {
    project_list: "all",
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
    project_assignUsers: "dev",
    workflow_list: "all",
    workflow_view: "all",
    workflow_edit: "all",
    workflow_create: "all",
    workflow_delete: "all",
  },
  Developer: {
    workflow_list: "all",
    workflow_view: "all",
    workflow_edit: "all",
    workflow_create: "all",
    workflow_delete: "all",
  },
  Tester: {
    workflow_list: "all",
    workflow_view: "all",
  },
  Member: {
    workflow_list: "all",
    workflow_view: "blockingConfigs",
  },
};
export const MyProjectRoles: _Permission.MyProjectRoles = {
  "1": { projectName: ProjectsMap[1].name, projectDir: ProjectsMap[1].dir, projectRole: "Owner" },
  // "2": { projectName: ProjectsMap[2].name, projectDir: ProjectsMap[2].dir, projectRole: "Admin" },
};
export function getPermissions(user: _App.AuthUser): _Permission.IPermissions {
  const systemPermissions = user.roles.reduce((obj, role) => {
    Object.assign(obj, SystemRoleConfg[role]);
    return obj;
  }, {} as _Permission.IPermissions);
  return systemPermissions;
}
