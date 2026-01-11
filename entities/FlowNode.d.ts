declare namespace FlowNode {
  interface IQuery extends App.IQuery {
    type?: "actuator" | "trigger";
    runtime?: "server" | "browser";
    store?: "remote" | "local" | "favs";
    parent?: string;
  }

  interface INode extends App.IResource {
    type: "actuator" | "trigger";
    name: string;
    icon: string;
    desc: string;
    content: string;
    package?: string;
    version?: string;
    keywords?: string;
    likes?: number;
    collected?: boolean;
    isFolder?: boolean;
    isSystem?: boolean;
  }

  type IQueryResult = App.IQueryResult<INode, IQuery>;

  type ICreateResult = App.ICreateResult;

  type IUpdateResult = App.IUpdateResult;
}
