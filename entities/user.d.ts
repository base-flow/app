declare namespace User {
  interface IUser extends App.IResource {
    id: string;
    username: string;
    age: number;
    password?: string;
    specialRole?: string;
  }

  interface IQuery extends App.IQuery {}

  type IQueryResult = App.IQueryResult<IUser, IQuery>;
}
