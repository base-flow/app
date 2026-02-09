declare namespace _App {
  interface Config {
    favMax: number;
    sharedMax: number;
    sharedContentMax: number;
    dirs: {
      workflow: { [key in Runtime]: string };
      node: { [key in Runtime]: string };
    };
  }
  interface AuthUser {
    id: string;
    username: string;
    nickname: string;
    dir: string;
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
  type EntitySpace = "personal" | "project" | "platform";
  type EntityType = "directory" | "workflow" | "node" | "data";
  type EntityFileType = "workflow" | "node" | "data";

  interface BaseEntity extends _Resource.IItem {
    type: EntityType;
    name: string;
    desc: string;
    icon?: string;
    parentId: string;
    path: string;
    spaceId: string;
    spaceType: EntitySpace;
    spaceDir: string;
  }

  interface IDirectory extends BaseEntity {
    type: "directory";
    children?: _Entity.IEntity[];
  }
}
