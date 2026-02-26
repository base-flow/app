declare namespace _Node {
  type Kind = "executor" | "trigger" | "snippet";

  interface INode extends _Entity.BaseEntity {
    type: "node";
    runtime: _App.Runtime;
    kind: Kind;
    npm?: string;
    content: string;
  }

  interface INodeDetail {
    id: string;
    content: string;
    released: boolean;
  }

  type UpdateResult = _Resource.IUpdateResult;

  type NpmInfo = Pick<INode, "name" | "runtime" | "kind" | "icon" | "desc">;
}
