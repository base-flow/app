declare namespace _Workflow {
  interface IWorkflow extends _Entity.BaseEntity {
    type: "workflow";
    runtime: _App.Runtime;
    content: string;
  }
  interface IWorkflowDetail {
    content: string;
    commitId: string;
    released: boolean;
  }
  type UpdateResult = _Resource.IUpdateResult;
}
