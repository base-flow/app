declare namespace _Node {
  type Kind = "executor" | "trigger" | "snippet";

  interface INode extends _Entity.BaseEntity {
    type: "node";
    kind: Kind;
    npm?: string;
  }

  interface INodeDetail {
    id: string;
    content: string;
  }

  type UpdateResult = _Resource.IUpdateResult;

  type NpmInfo = Pick<INode, "name" | "runtime" | "kind" | "icon" | "desc">;
}
