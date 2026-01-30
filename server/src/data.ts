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
    roles: ["Admin"],
  },
  {
    id: "2",
    username: "maria",
    nickname: "多啦啊嘛",
    password: "123456",
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
  dir: "",
  publicDir: "",
  totalWorkflows: randomInt(10, 100),
  totalNodes: randomInt(10, 100),
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
      updateDate: "@datetime",
      totalItems: 34,
      totalWorkflows: 4,
      totalNodes: 5,
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
  space: { id: string; type: _App.EntrySpace },
  level: number,
  singleType?: "workflow" | "node",
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
    const int = singleType === "workflow" ? 2 : singleType === "node" ? 1 : randomInt(1, 2);
    if (int === 2) {
      const item: _Workflow.IWorkflow = {
        id: `${uid++}`,
        type: "workflow",
        name: Random.ctitle(10, 20),
        desc: Random.csentence(20, 60),
        parentId,
        path: "",
        spaceType: space.type,
        spaceId: space.id,
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

function createDir(space: { type: _App.EntrySpace; id: string }, name: string, children?: string[]) {
  const item: _App.IDirectory = {
    id: `${uid++}`,
    type: "directory",
    name,
    desc: Random.csentence(20, 60),
    parentId: "",
    path: "",
    spaceType: space.type,
    spaceId: space.id,
    children: [],
  };
  item.path = `/${item.id} ${item.name}`;
  EntityMap[item.id] = item;
  item.children = createEntities(
    item.id,
    `/${item.id} ${item.name}`,
    space,
    2,
    name.startsWith("workflow-") ? "workflow" : name.startsWith("node-") ? "node" : undefined,
    children,
  );
  return item;
}

function createPlatformEntities() {
  const drive: _App.IDirectory[] = [];
  drive.push(createDir({ type: "personal", id: Users[0].id }, Users[0].username, ["public"]));
  drive.push(createDir({ type: "personal", id: Users[1].id }, Users[1].username, ["public"]));
  drive.push(createDir({ type: "project", id: Projects[0].id }, Projects[0].name, ["public"]));
  drive.push(createDir({ type: "project", id: Projects[1].id }, Projects[1].name, ["public"]));
  drive.push(createDir({ type: "platform", id: "" }, "workflow-server"));
  drive.push(createDir({ type: "platform", id: "" }, "workflow-browser"));
  drive.push(createDir({ type: "platform", id: "" }, "node-server"));
  drive.push(createDir({ type: "platform", id: "" }, "node-browser"));
  return drive;
}

export const EntityList = createPlatformEntities();

const adminFolder = EntityList.find((item) => item.name === "admin") as _App.IDirectory;
const mariaFolder = EntityList.find((item) => item.name === "maria") as _App.IDirectory;
const deepseekFolder = EntityList.find((item) => item.name === "deepseek") as _App.IDirectory;
const googleFolder = EntityList.find((item) => item.name === "google") as _App.IDirectory;

Personals[0].dir = adminFolder.id;
Personals[0].publicDir = adminFolder.children!.find((item) => item.name === "public")?.id || "";
Personals[1].dir = mariaFolder.id;
Personals[1].publicDir = mariaFolder.children!.find((item) => item.name === "public")?.id || "";

Projects[0].dir = deepseekFolder.id;
Projects[0].publicDir = deepseekFolder.children!.find((item) => item.name === "public")?.id || "";
Projects[1].dir = googleFolder.id;
Projects[1].publicDir = googleFolder.children!.find((item) => item.name === "public")?.id || "";
