declare namespace _App {
  interface IAuthUser {
    id: string;
    username: string;
    nickname: string;
    roles: _Permission.SystemRole[];
  }

  interface IProfileUser extends IAuthUser {
    password?: string;
    age?: number;
  }
  interface AuthLogin {
    username: string;
    password: string;
    redirect?: string;
  }

  interface FavoriteList {
    node: string[];
  }

  type Runtime = "server" | "browser";
  type Scope = "personal" | "project" | "platform";
  type EntryType = "directory" | "workflow" | "node";

  interface BaseEntry extends _Resource.IItem {
    type: EntryType;
    name: string;
    desc: string;
    parent: string;
    path: string;
  }

  interface IDirectory extends BaseEntry {
    type: "directory";
    children: BaseEntry[];
  }
}
