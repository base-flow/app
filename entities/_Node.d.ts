declare namespace _Node {
  type NodeType = "executor" | "trigger";

  interface INode extends _App.BaseEntry {
    type: "node";
    runtime: _App.Runtime;
    nodeType: NodeType;
    content: string;
    package: string;
    version: string;
    likes: number;
  }

  interface Query extends _Entity.Query {
    runtime?: _App.Runtime;
    nodeType?: NodeType;
  }

  type QueryResult = _Resource.IQueryResult<INode, Query>;
  type CreateResult = _Resource.ICreateResult;
  type UpdateResult = _Resource.IUpdateResult;
}
