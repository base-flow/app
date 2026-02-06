declare namespace _Shared {
  interface Query {
    spaceId: string;
    spaceType: "personal" | "project";
  }
  interface IShared extends _Resource.IItem {
    name: string;
    expiresAt: number;
    viewed: number;
    spaceId: string;
    spaceType: "personal" | "project";
    spaceDir: string;
    spaceName: string;
    spaceLogo: string;
    spaceRemark?: string;
  }

  interface IGotShared extends IShared {
    sharedId: string;
  }

  // interface ContentQuery {
  //   dir?: string;
  //   //当keyword不存在时：如果指定了类型，列表子孙，否则仅列表当前目录
  //   //当keyword存在时：搜索子孙
  //   type?: "workflow" | "node";
  // }

  // interface ContentQuerySummary extends _Resource.IQuerySummary {
  //   path: string;
  // }

  // type ContentQueryResult = _Resource.IQueryResult<_Entity.IEntity, ContentQuery, ContentQuerySummary>;
}
