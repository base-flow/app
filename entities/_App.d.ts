declare namespace _App {
  interface IAuthUser {
    id: string;
    username: string;
    nickname: string;
    roles: _Permission.SystemRole[];
    directory: string;
  }

  interface IProfileUser extends IAuthUser {
    password?: string;
    age?: number;
  }
  interface AuthLogin {
    username: string;
    password: string;
    redirect: string;
  }

  interface IDirectory extends _Resource.IItem {
    name: string;
    type: "directory";
    desc: string;
  }

  type Runtime = "server" | "browser";
  type Scope = "personal" | "project" | "platform";
  type Repository = "remote" | "local";

  interface FavoriteList {
    node: string[];
  }
}
