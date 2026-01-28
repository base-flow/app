declare namespace _Entity {
  // type Scope = "personal" | "project" | "platform";
  // type Repository = "remote" | "local";
  // type NodeType = "executor" | "trigger";

  type IEntity = _App.IDirectory | _Workflow.IWorkflow | _Node.INode;

  interface Query extends _Resource.IQuery {
    dir?: string;
    //如果指定了类型，查找子孙，否则仅查找当前目录
    //all必须在keyword存在时生效
    type?: "workflow" | "node" | "all";
  }

  interface QuerySummary extends _Resource.IQuerySummary {
    path: string;
    spaceType: _App.EntrySpace;
    spaceId: string;
  }
  type QueryResult = _Resource.IQueryResult<IEntity, Query, QuerySummary>;

  type CreateResult = _Resource.ICreateResult;
  type UpdateResult = _Resource.IUpdateResult;
}
