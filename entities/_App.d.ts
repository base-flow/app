declare namespace _App {
  interface Config {
    favMax: number;
    sharedMax: number;
    sharedContentMax: number;
    platformDirs: {
      workflow: { [key in Runtime]: string };
      node: { [key in Runtime]: string };
    };
  }
  interface AuthUser {
    id: string;
    username: string;
    dir: string;
    role: SystemRole;
  }

  interface MyProjects {
    [projectId: string]: { projectName: string; projectDir: string; projectRole: ProjectRole };
  }

  interface MyProfile {
    nickname: string;
    myProjects: MyProjects;
  }

  interface AuthLogin {
    username: string;
    password: string;
    redirect?: string;
  }

  type SystemRole = "Owner" | "Admin" | "Member" | "Guest";
  type ProjectRole = "Owner" | "Admin" | "Developer" | "Tester" | "Member";

  type Runtime = "server" | "browser";
  type EntitySpace = "personal" | "project" | "platform";
  type EntityType = "directory" | "workflow" | "node" | "data";
  type EntityFileType = "workflow" | "node" | "data";
}
