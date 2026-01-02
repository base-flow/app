declare namespace Nodes{

  interface IQuery extends Core.IQuery {
    type?: 'actuator' | 'trigger';
    runtime?: 'server' | 'browser';
    store?: 'remote' | 'local' | 'favs';
    parent?: string;
  }

  interface INode extends Core.IResource {
    type: 'actuator' | 'trigger';
    name: string;
    icon: string;
    desc: string;
    vers: string[];
    content: string;
    keywords?: string;
    likes?: number;
    collected?: boolean;
    isFolder?: boolean;
    isSystem?: boolean;
  }

  type IQueryResult = Core.IQueryResult<INode, IQuery>;

  type ICreateResult = Core.ICreateResult;

  type IUpdateResult = Core.IUpdateResult;
}
