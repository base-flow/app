declare namespace FlowApp {
  interface IQuery extends App.IQuery {}

  interface IApp extends App.IResource {
    name: string;
    desc: string;
    logo: string;
    updateDate: string;
    collected?: boolean;
    totalFlows: number;
    flowsNumber: {
      [key in App.Runtime]: number;
    };
  }

  type IQueryResult = App.IQueryResult<IApp, IQuery>;

  type ICreateResult = App.ICreateResult;

  type IUpdateResult = App.IUpdateResult;
}
