declare namespace Flow{

  interface IQuery extends Core.IQuery {
    appId?: string;
    templated?: boolean;
  }

  interface IFlow extends Core.IResource {
    version: string;
    commitId: string;
    released: boolean;
    name: string;
    desc: string;
    content: string;
    nodes: number;
    connectors: number;
    likes: number;
    templated?: boolean;
    appId: string;
    appLogo?: string;
    appName?: string;
    collected?: boolean;
  }

  type IQueryResult = Core.IQueryResult<IFlow, IQuery>;

  type ICreateResult = Core.ICreateResult;

  type IUpdateResult = Core.IUpdateResult;

}
