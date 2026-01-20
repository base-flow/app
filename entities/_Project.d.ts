declare namespace _Project {
  interface Query extends _Resource.IQuery {}

  interface IProject extends _Resource.IItem {
    name: string;
    desc: string;
    logo: string;
    totalItems: number;
  }

  type QueryResult = _Resource.IQueryResult<IProject, Query>;
  type CreateResult = _Resource.ICreateResult;
  type UpdateResult = _Resource.IUpdateResult;

  interface IMember {
    id: string;
    username: string;
    nickname: string;
    projectRole: _Permission.ProjectRole;
  }

  interface CreateMemberData {
    id: string;
    projectRole: _Permission.ProjectRole;
  }
}
