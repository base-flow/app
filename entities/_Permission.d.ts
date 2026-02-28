declare namespace _Permission {
  type ProjectAssignUserScope = "all" | "admin" | "dev";
  type ProjectListScope = "all" | "involved";
  type FlowViewScope = "all" | "blockingConfigs";
  type ResourceOwnerScope = "all" | "owner";

  interface Actions {
    project_list: ProjectListScope;
    project_edit: "all";
    project_create: "all";
    project_delete: "all";
    project_assignUsers: ProjectAssignUserScope;
    workflow_list: "all";
    workflow_view: FlowViewScope;
    workflow_edit: "all";
    workflow_create: "all";
    workflow_delete: "all";
    node_list: "all";
    node_view: "all";
    node_edit: ResourceOwnerScope;
    node_create: "all";
    node_delete: ResourceOwnerScope;
  }

  type SystemRole = "SuperAdmin" | "Admin" | "Member" | "Guest";
  type ProjectRole = "Owner" | "Admin" | "Developer" | "Tester" | "Member";

  interface MyProjectRoles {
    [projectId: string]: { projectName: string; projectDir: string; projectRole: ProjectRole };
  }

  type IPermissions = { [key in keyof Actions]?: Actions[key] };
  type SystemRoleConfg = { [key in SystemRole]: IPermissions };
  type ProjectRoleConfg = { [key in ProjectRole]: IPermissions };

  interface QueryPermissionsResult {
    systemRoleConfg: SystemRoleConfg;
    projectRoleConfg: ProjectRoleConfg;
    myProjectRoles: MyProjectRoles;
  }
}
