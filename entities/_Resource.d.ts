declare namespace _Resource {
  interface IItem {
    id: string;
    updateAt?: string;
    createAt?: string;
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

  interface IQuerySummary {
    total: number;
    page: number;
    pageSize: number;
  }

  interface IQueryResult<T extends IItem, Q extends IQuery = IQuery, S extends IQuerySummary = IQuerySummary> {
    query: Q;
    list: T[];
    summary: S;
  }

  interface ICreateResult {
    id: string;
  }

  interface IUpdateResult {
    id: string;
  }
}
