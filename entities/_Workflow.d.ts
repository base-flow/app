declare namespace _Workflow {
  interface Query extends _Resource.IQuery {
    scope?: _App.Scope;
    runtime?: _App.Runtime;
    directory?: string;
  }

  interface IWorkflow extends _Resource.IItem {
    name: string;
    type: "workflow";
    desc: string;
  }

  type QueryResult = _Resource.IQueryResult<IWorkflow | _App.IDirectory, Query>;
  type CreateResult = _Resource.ICreateResult;
  type UpdateResult = _Resource.IUpdateResult;
}
