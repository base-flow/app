declare namespace _Entity {
  // type Scope = "personal" | "project" | "platform";
  // type Repository = "remote" | "local";

  interface BaseEntity extends _Resource.IItem {
    type: _App.EntityType;
    name: string;
    desc: string;
    icon?: string;
    homepage?: string;
    likes?: number;
    parentId: string;
    path: string;
    spaceId: string;
    spaceType: _App.EntitySpace;
    spaceDir: string;
  }

  interface IDirectory extends BaseEntity {
    type: "directory";
    children?: IEntity[];
  }

  type IEntity = IDirectory | _Workflow.IWorkflow | _Node.INode | _Data.IData;

  interface Query extends _Resource.IQuery {
    dir?: string;
    //当type为directory时：特殊处理，忽略其它条件，列出当前目录下的目录
    //当keyword不存在时：有type类型：列表子孙；无type类型：仅列表当前目录
    //当keyword存在时：有type类型：搜索子孙后按type过滤；无type类型：搜索子孙后全部列表
    type?: _App.EntityType;
  }

  interface QueryFile extends _Resource.IQuery {
    dir?: string;
    //当type为directory时：特殊处理，忽略其它条件，列出当前目录下的目录
    //当keyword不存在时：有type类型：列表子孙；无type类型：仅列表当前目录
    //当keyword存在时：有type类型：搜索子孙后按type过滤；无type类型：搜索子孙后全部列表
    type?: _App.EntityFileType;
  }

  interface QuerySummary extends _Resource.IQuerySummary {
    path: string;
    // spaceType: _App.EntitySpace;
    // spaceId: string;
  }
  type QueryResult = _Resource.IQueryResult<IEntity, Query, QuerySummary>;

  type CreateResult = _Resource.ICreateResult;
  type UpdateResult = _Resource.IUpdateResult;
}
