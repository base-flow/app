declare namespace _Workflow {
  interface Query extends _Resource.IQuery {
    directory?: string;
    runtime?: _App.Runtime;
  }

  interface IWorkflow extends _Resource.IItem {
    name: string;
    type: "workflow";
    directoryId: string;
    desc: string;
  }

  type QueryResult = _Resource.IQueryResult<IWorkflow | _App.IDirectory, Query>;
  type CreateResult = _Resource.ICreateResult;
  type UpdateResult = _Resource.IUpdateResult;
}
