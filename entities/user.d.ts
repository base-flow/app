declare namespace User {
  interface IUser extends App.IResource {
    id: string;
    username: string;
    nickname: string;
    phone?: string;
    age?: number;
    password?: string;
  }

  interface IQuery extends App.IQuery {}

  type IQueryResult = App.IQueryResult<IUser, IQuery>;
}
