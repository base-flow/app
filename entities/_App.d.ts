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
}
