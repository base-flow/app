declare namespace Apps{

  interface IQuery extends Core.IQuery {
  }

  interface IApp extends Core.IResource {
    name: string;
    desc: string;
    logo: string;
    type?: 'system';
    updateDate: string;
    collected?: boolean;
  }

  type IQueryResult = Core.IQueryResult<IApp, IQuery>;

  type ICreateResult = Core.ICreateResult;

  type IUpdateResult = Core.IUpdateResult;
}
