declare namespace _Data {
  interface IData extends _App.BaseEntity {
    type: "data";
    likes: number;
  }
  interface Query extends _Entity.Query {}

  type QueryResult = _Resource.IQueryResult<IData, Query>;
  type CreateResult = _Resource.ICreateResult;
  type UpdateResult = _Resource.IUpdateResult;
}
