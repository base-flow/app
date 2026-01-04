declare namespace FlowApp {
  interface IQuery extends App.IQuery {}

  interface IApp extends App.IResource {
    name: string;
    desc: string;
    logo: string;
    type?: "system";
    updateDate: string;
    collected?: boolean;
  }

  type IQueryResult = App.IQueryResult<IApp, IQuery>;

  type ICreateResult = App.ICreateResult;

  type IUpdateResult = App.IUpdateResult;
}
