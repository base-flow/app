declare namespace _Node {
  type NodeType = "executor" | "trigger";

  interface Query extends _Resource.IQuery {
    repository?: _App.Repository;
    scope?: _App.Scope;
    runtime?: _App.Runtime;
    nodeType?: NodeType;
    directory?: string;
  }

  interface INode extends _Resource.IItem {
    name: string;
    type: "node";
    nodeType: NodeType;
    icon: string;
    desc: string;
    content: string;
    package: string;
    version: string;
    likes: number;
  }

  type QueryResult = _Resource.IQueryResult<INode | _App.IDirectory, Query>;
  type CreateResult = _Resource.ICreateResult;
  type UpdateResult = _Resource.IUpdateResult;
}
