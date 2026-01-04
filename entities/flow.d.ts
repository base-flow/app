declare namespace Flow {
  interface IQuery extends App.IQuery {
    appId?: string;
    templated?: boolean;
  }

  interface IFlow extends App.IResource {
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

  type IQueryResult = App.IQueryResult<IFlow, IQuery>;

  type ICreateResult = App.ICreateResult;

  type IUpdateResult = App.IUpdateResult;
}
