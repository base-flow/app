declare namespace App {
  interface IAuthUser {
    id: string;
    username: string;
    roles?: string[];
  }

  interface IProfileUser extends IAuthUser {
    age: number;
  }
  interface AuthLogin {
    username: string;
    password: string;
    redirect: string;
  }

  interface IResource {
    id: string;
    updateDate: string;
    createDate: string;
    createBy: string;
    updateBy: string;
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
}
