declare namespace _User {
  interface Query extends _Resource.IQuery {}

  interface IUser extends _Resource.IItem {
    username: string;
    nickname: string;
    phone?: string;
    age?: number;
    password?: string;
  }

  type QueryResult = _Resource.IQueryResult<IUser, Query>;
}
