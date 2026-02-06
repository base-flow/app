declare namespace _Entity {
  // type Scope = "personal" | "project" | "platform";
  // type Repository = "remote" | "local";
  // type NodeType = "executor" | "trigger";

  type IEntity = _App.IDirectory | _Workflow.IWorkflow | _Node.INode;

  interface Query extends _Resource.IQuery {
    dir?: string;
    //当keyword不存在时：如果指定了类型，列表子孙，否则仅列表当前目录
    //当keyword存在时：搜索子孙
    type?: "workflow" | "node";
  }

  interface QuerySummary extends _Resource.IQuerySummary {
    path: string;
    // spaceType: _App.EntrySpace;
    // spaceId: string;
  }
  type QueryResult = _Resource.IQueryResult<IEntity, Query, QuerySummary>;

  type CreateResult = _Resource.ICreateResult;
  type UpdateResult = _Resource.IUpdateResult;
}
