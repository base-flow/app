declare namespace _Workflow {
  interface IWorkflow extends _Entity.BaseEntity {
    type: "workflow";
    runtime: _App.Runtime;
    likes: number;
  }
  interface Query extends _Entity.Query {
    runtime?: _App.Runtime;
  }

  type QueryResult = _Resource.IQueryResult<IWorkflow, Query>;
  type CreateResult = _Resource.ICreateResult;
  type UpdateResult = _Resource.IUpdateResult;
}
