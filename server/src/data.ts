import { FlagSrc, randomInt } from "@/utils";

const Mock = require("mockjs");
var Random = Mock.Random;
let uid = 1;

export const Users: Array<_App.AuthUser & { password: string }> = [
  {
    id: "1",
    username: "admin",
    nickname: "小布丁",
    password: "123456",
    dir: "",
    roles: ["Admin"],
  },
  {
    id: "2",
    username: "maria",
    nickname: "多啦啊嘛",
    password: "123456",
    dir: "",
    roles: ["Member"],
  },
];

export const UsersMap: { [id: string]: _App.AuthUser & { password: string } } = Users.reduce((obj, cur) => {
  obj[cur.id] = cur;
  return obj;
}, {} as any);

export const Personals: _Personal.IPersonal[] = Users.map(({ id, username, nickname }) => ({
  id,
  username,
  nickname,
  avatar: "",
  dir: "",
  publicDir: "",
  totalWorkflows: randomInt(10, 100),
  totalNodes: randomInt(10, 100),
  totalPublics: randomInt(10, 100),
  totalItems: randomInt(10, 100),
}));

export const PersonalsMap: { [id: string]: _Personal.IPersonal } = Personals.reduce((obj, cur) => {
  obj[cur.id] = cur;
  return obj;
}, {} as any);

const Projects: _Project.IProject[] = Mock.mock({
  "list|50": [
    {
      "id|+1": 3,
      name: "@ctitle(10, 20)",
      logo: "emoji://#fef7c3@:smile:@😀",
      desc: "@csentence(20, 60)",
      dir: "",
      publicDir: "",
      updateAt: "@datetime",
      totalItems: 34,
      totalWorkflows: 4,
      totalNodes: 5,
      totalPublics: 23,
    },
  ],
}).list.map((item: any) => ({ ...item, id: `${item.id}`, logo: FlagSrc.create() }));

Projects.unshift(
  {
    id: "1",
    name: "deepseek",
    desc: Random.csentence(20, 60),
    logo: FlagSrc.create(),
    dir: "",
    publicDir: "",
    totalItems: 34,
    totalWorkflows: 4,
    totalNodes: 5,
    totalPublics: 23,
  },
  {
    id: "2",
    name: "google",
    desc: Random.csentence(20, 60),
    logo: FlagSrc.create(),
    dir: "",
    publicDir: "",
    totalItems: 34,
    totalWorkflows: 4,
    totalNodes: 5,
    totalPublics: 23,
  },
);

export const ProjectsMap: { [id: string]: _Project.IProject } = Projects.reduce((obj, cur) => {
  obj[cur.id] = cur;
  return obj;
}, {} as any);

export const EntityMap: { [id: string]: _Entity.IEntity } = {};

function createEntities(
  parentId: string,
  parentPath: string,
  space: { id: string; type: _App.EntitySpace; dir: string },
  level: number,
  singleType?: _App.EntityFileType,
  children: string[] = [],
) {
  const dirs: _Entity.IEntity[] = new Array(3).fill("").map(() => {
    const name = children.shift();
    const item: _App.IDirectory = {
      id: `${uid++}`,
      type: "directory",
      name: name || Random.ctitle(5, 10),
      desc: Random.csentence(20, 60),
      parentId,
      path: "",
      spaceType: space.type,
      spaceId: space.id,
      spaceDir: space.dir,
      children: [],
    };
    item.path = `${parentPath}/${item.id} ${item.name}`;
    EntityMap[item.id] = item;
    if (level > 0) {
      item.children = createEntities(item.id, item.path, space, level - 1, singleType);
    }
    return item;
  });
  const items: _Entity.IEntity[] = new Array(20).fill("").map(() => {
    const int = singleType === "data" ? 3 : singleType === "workflow" ? 2 : singleType === "node" ? 1 : randomInt(1, 3);
    if (int === 3) {
      const item: _Data.IData = {
        id: `${uid++}`,
        type: "data",
        name: Random.ctitle(10, 20),
        desc: Random.csentence(20, 60),
        parentId,
        path: "",
        spaceType: space.type,
        spaceId: space.id,
        spaceDir: space.dir,
        likes: 21,
      };
      item.path = `${parentPath}/${item.id} ${item.name}`;
      EntityMap[item.id] = item;
      return item;
    } else if (int === 2) {
      const item: _Workflow.IWorkflow = {
        id: `${uid++}`,
        type: "workflow",
        name: Random.ctitle(10, 20),
        desc: Random.csentence(20, 60),
        parentId,
        path: "",
        spaceType: space.type,
        spaceId: space.id,
        spaceDir: space.dir,
        runtime: Random.pick(["server", "browser"]),
        likes: 21,
      };
      item.path = `${parentPath}/${item.id} ${item.name}`;
      EntityMap[item.id] = item;
      return item;
    } else {
      const item: _Node.INode = {
        id: `${uid++}`,
        type: "node",
        name: Random.ctitle(10, 20),
        desc: Random.csentence(20, 60),
        parentId,
        path: "",
        spaceType: space.type,
        spaceId: space.id,
        spaceDir: space.dir,
        runtime: Random.pick(["server", "browser"]),
        nodeType: Random.pick(["executor", "trigger"]),
        icon: "",
        package: "@baseflow/aaa",
        content: "",
        version: "2.5.12",
        likes: 23,
      };
      item.path = `${parentPath}/${item.id} ${item.name}`;
      EntityMap[item.id] = item;
      return item;
    }
  });
  return dirs.concat(items);
}

function createRootDir(space: { type: _App.EntitySpace; id: string }, name: string, children?: string[]) {
  const item: _App.IDirectory = {
    id: `${uid++}`,
    type: "directory",
    name,
    desc: Random.csentence(20, 60),
    parentId: "",
    path: "",
    spaceDir: "",
    spaceType: space.type,
    spaceId: space.id,
    children: [],
  };
  item.spaceDir = item.id;
  item.path = `/${item.id} ${item.name}`;
  EntityMap[item.id] = item;
  item.children = createEntities(
    item.id,
    `/${item.id} ${item.name}`,
    { ...space, dir: item.id },
    2,
    name.startsWith("workflow-") ? "workflow" : name.startsWith("node-") ? "node" : undefined,
    children,
  );
  return item;
}

function createPlatformEntities() {
  const drive: _App.IDirectory[] = [];
  drive.push(createRootDir({ type: "personal", id: Users[0].id }, Users[0].username, ["public"]));
  drive.push(createRootDir({ type: "personal", id: Users[1].id }, Users[1].username, ["public"]));
  drive.push(createRootDir({ type: "project", id: Projects[0].id }, Projects[0].name, ["public"]));
  drive.push(createRootDir({ type: "project", id: Projects[1].id }, Projects[1].name, ["public"]));
  drive.push(createRootDir({ type: "platform", id: "workflow/server" }, "workflow-server"));
  drive.push(createRootDir({ type: "platform", id: "workflow/browser" }, "workflow-browser"));
  drive.push(createRootDir({ type: "platform", id: "node/server" }, "node-server"));
  drive.push(createRootDir({ type: "platform", id: "node/browser" }, "node-browser"));
  return drive;
}

export const EntityList = createPlatformEntities();

const adminFolder = EntityList.find((item) => item.name === "admin") as _App.IDirectory;
const mariaFolder = EntityList.find((item) => item.name === "maria") as _App.IDirectory;
const deepseekFolder = EntityList.find((item) => item.name === "deepseek") as _App.IDirectory;
const googleFolder = EntityList.find((item) => item.name === "google") as _App.IDirectory;

Users[0].dir = adminFolder.id;
Users[1].dir = mariaFolder.id;
Personals[0].dir = adminFolder.id;
Personals[0].publicDir = adminFolder.children!.find((item) => item.name === "public")?.id || "";
Personals[1].dir = mariaFolder.id;
Personals[1].publicDir = mariaFolder.children!.find((item) => item.name === "public")?.id || "";

Projects[0].dir = deepseekFolder.id;
Projects[0].publicDir = deepseekFolder.children!.find((item) => item.name === "public")?.id || "";
Projects[1].dir = googleFolder.id;
Projects[1].publicDir = googleFolder.children!.find((item) => item.name === "public")?.id || "";

export const FavoriteList: { [id: string]: boolean } = {};

export const SharedList: (_Shared.IShared & { content: _Entity.IEntity[] })[] = [
  {
    id: `${uid++}`,
    name: Random.ctitle(5, 10),
    expiresAt: Date.now(),
    createAt: Random.datetime(),
    viewed: randomInt(10, 100),
    spaceType: "personal",
    spaceId: Personals[0].id,
    spaceDir: Personals[0].dir,
    spaceName: Personals[0].nickname,
    spaceRemark: Personals[0].username,
    spaceLogo: "",
    createBy: Personals[0].username,
    content: [],
  },
  {
    id: `${uid++}`,
    name: Random.ctitle(5, 10),
    expiresAt: Date.now(),
    createAt: Random.datetime(),
    viewed: randomInt(10, 100),
    spaceType: "personal",
    spaceId: Personals[1].id,
    spaceDir: Personals[1].dir,
    spaceName: Personals[1].nickname,
    spaceRemark: Personals[1].username,
    spaceLogo: "",
    createBy: Personals[1].username,
    content: [],
  },
  {
    id: `${uid++}`,
    name: Random.ctitle(5, 10),
    expiresAt: Date.now(),
    createAt: Random.datetime(),
    viewed: randomInt(10, 100),
    spaceType: "project",
    spaceId: Projects[0].id,
    spaceDir: Projects[0].dir,
    spaceName: Projects[0].name,
    spaceLogo: Projects[0].logo,
    createBy: Users[0].username,
    content: [],
  },
  {
    id: `${uid++}`,
    name: Random.ctitle(5, 10),
    expiresAt: Date.now(),
    createAt: Random.datetime(),
    viewed: randomInt(10, 100),
    spaceType: "project",
    spaceId: Projects[1].id,
    spaceDir: Projects[1].dir,
    spaceName: Projects[1].name,
    spaceLogo: Projects[1].logo,
    createBy: Users[1].username,
    content: [],
  },
];

console.log(SharedList);
export const SharedMap: { [id: string]: _Shared.IShared & { content: _Entity.IEntity[] } } = SharedList.reduce((obj, cur) => {
  obj[cur.id] = cur;
  return obj;
}, {} as any);

export const GotSharedList: _Shared.IGotShared[] = SharedList.map((item) => ({ ...item, sharedId: item.id, id: `${uid++}` }));
