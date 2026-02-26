declare namespace _Workflow {
  interface IWorkflow extends _Entity.BaseEntity {
    type: "workflow";
    runtime: _App.Runtime;
    version?: string;
    released?: boolean;
  }
  interface IWorkflowDetail {
    id: string;
    content: string;
    commitId: string;
  }
  type UpdateResult = _Resource.IUpdateResult;
}
