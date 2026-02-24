declare namespace _Node {
  type Kind = "executor" | "trigger" | "snippet";

  interface INode extends _Entity.BaseEntity {
    type: "node";
    runtime: _App.Runtime;
    kind: Kind;
    content: string;
    package: string;
    version: string;
    likes: number;
    npm?: string;
  }

  interface Query extends _Entity.Query {
    runtime?: _App.Runtime;
    kind?: Kind;
  }

  type QueryResult = _Resource.IQueryResult<INode, Query>;
  type CreateResult = _Resource.ICreateResult;
  type UpdateResult = _Resource.IUpdateResult;

  type NpmInfo = Pick<INode, "name" | "runtime" | "kind" | "icon" | "desc">;
}
