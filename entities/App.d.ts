declare namespace App {
  interface Actions {
    app_list: "all" | "involved";
    app_view: "all";
    app_edit: "all";
    app_create: "all";
    app_delete: "all";
    app_assignUsers: "all" | "admin" | "dev";
    flow_list: "all";
    flow_view: "all" | "blockingConfigs";
    flow_edit: "all";
    flow_create: "all";
    flow_delete: "all";
    user_list: "all";
  }

  type SysRole = "Admin" | "Member" | "Guest";
  type AppRole = "Owner" | "Admin" | "Developer" | "Tester" | "Member";

  interface ResourceRoles {
    app: { [appId: string]: AppRole };
  }

  type IPermissions = { [key in keyof Actions]?: Actions[key] };
  type SysRolesConfg = { [key in SysRole]: IPermissions };
  type AppRolesConfg = { [key in AppRole]: IPermissions };
  interface IQueryPermissionsResult {
    sysRolesConfg: SysRolesConfg;
    appRolesConfg: AppRolesConfg;
    resourceRoles: ResourceRoles;
  }
  interface IAuthUser {
    id: string;
    username: string;
    nickname: string;
    roles: SysRole[];
  }

  interface IProfileUser extends IAuthUser {
    password?: string;
    age?: number;
  }
  interface AuthLogin {
    username: string;
    password: string;
    redirect: string;
  }

  interface IResource {
    id: string;
    updateDate?: string;
    createDate?: string;
    createBy?: string;
    updateBy?: string;
  }

  interface IQuery {
    keyword?: string;
    page?: number;
    pageSize?: number;
    sorterField?: string;
    sorterOrder?: "ascend" | "descend";
  }

  interface ISummary {
    total: number;
    page: number;
    pageSize: number;
    path?: [string, string][];
  }

  interface IQueryResult<R extends IResource, Q extends IQuery = {}, S extends ISummary = ISummary> {
    query: Q;
    list: R[];
    summary: S;
  }

  interface ICreateResult {
    id: string;
  }

  interface IUpdateResult {
    id: string;
  }

  type Runtime = "server" | "browser";
}
