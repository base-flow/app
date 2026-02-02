declare namespace _App {
  interface Config {
    favMax: number;
    dirs: {
      workflow: { [key in Runtime]: string };
      node: { [key in Runtime]: string };
    };
  }
  interface AuthUser {
    id: string;
    username: string;
    nickname: string;
    roles: _Permission.SystemRole[];
  }

  interface ProfileUser {
    age?: number;
  }
  interface AuthLogin {
    username: string;
    password: string;
    redirect?: string;
  }

  type Runtime = "server" | "browser";
  type EntrySpace = "personal" | "project" | "platform";
  type EntryType = "directory" | "workflow" | "node";

  interface BaseEntry extends _Resource.IItem {
    type: EntryType;
    name: string;
    desc: string;
    icon?: string;
    parentId: string;
    path: string;
    spaceId: string;
    spaceType: EntrySpace;
  }

  interface IDirectory extends BaseEntry {
    type: "directory";
    children?: _Entity.IEntity[];
  }
}
