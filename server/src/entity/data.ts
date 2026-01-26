import { randomInt } from "@/utils";

const Mock = require("mockjs");
var Random = Mock.Random;

let uid = 1;

export const EntityMap: { [id: string]: _Entity.IEntity } = {};

function createEntities(parentId: string, parentPath: string, level: number) {
  const dirs: _Entity.IEntity[] = new Array(3).fill("").map(() => {
    const item: _App.IDirectory = {
      id: `${uid++}`,
      type: "directory",
      name: Random.ctitle(5, 10),
      desc: Random.csentence(20, 60),
      parentId,
      parentPath,
      children: [],
      dir: "",
    };
    if (level > 0) {
      item.children = createEntities(item.id, `${parentPath}/${item.id} ${item.name}`, level - 1);
    }
    item.dir = item.id;
    EntityMap[item.dir] = item;
    return item;
  });
  const items: _Entity.IEntity[] = new Array(20).fill("").map(() => {
    const int = randomInt(1, 2);
    if (int === 2) {
      const item: _Workflow.IWorkflow = {
        id: `${uid++}`,
        type: "workflow",
        name: Random.ctitle(10, 20),
        desc: Random.csentence(20, 60),
        parentId,
        parentPath,
        runtime: Random.pick(["server", "browser"]),
        dir: "",
        likes: 21,
      };
      item.dir = item.id;
      EntityMap[item.dir] = item;
      return item;
    } else {
      const item: _Node.INode = {
        id: `${uid++}`,
        type: "node",
        name: Random.ctitle(10, 20),
        desc: Random.csentence(20, 60),
        parentId,
        parentPath,
        runtime: Random.pick(["server", "browser"]),
        nodeType: Random.pick(["executor", "trigger"]),
        icon: "",
        package: "@baseflow/aaa",
        content: "",
        version: "2.5.12",
        likes: 23,
        dir: "",
      };
      item.dir = item.id;
      EntityMap[item.dir] = item;
      return item;
    }
  });
  return dirs.concat(items);
}

export const EntityList = createEntities("", "", 2);

export const PlatformEntityMap: { [id: string]: _Entity.IEntity } = {};

function createPlatformEntities() {
  const dirs: { workflow: _Entity.IEntity[]; node: _Entity.IEntity[] } = { workflow: [], node: [] };
  let item: _App.IDirectory, subItem: _App.IDirectory;

  item = {
    id: `${uid++}`,
    type: "directory",
    name: "服务器运行",
    desc: Random.csentence(20, 60),
    parentId: "",
    parentPath: "",
    children: [],
    dir: "",
  };
  item.children = createEntities(item.id, `/${item.id} ${item.name}`, 2);
  item.dir = item.id;
  PlatformEntityMap[item.dir] = item;
  dirs.workflow.push(item);

  item = {
    id: `${uid++}`,
    type: "directory",
    name: "浏览器运行",
    desc: Random.csentence(20, 60),
    parentId: "",
    parentPath: "",
    children: [],
    dir: "",
  };
  item.children = createEntities(item.id, `/${item.id} ${item.name}`, 2);
  item.dir = item.id;
  PlatformEntityMap[item.dir] = item;
  dirs.workflow.push(item);

  item = {
    id: `${uid++}`,
    type: "directory",
    name: "服务器运行",
    desc: Random.csentence(20, 60),
    parentId: "",
    parentPath: "",
    children: [],
    dir: "",
  };
  item.children = createEntities(item.id, `/${item.id} ${item.name}`, 2);
  item.dir = item.id;
  PlatformEntityMap[item.dir] = item;
  dirs.node.push(item);

  item = {
    id: `${uid++}`,
    type: "directory",
    name: "浏览器运行",
    desc: Random.csentence(20, 60),
    parentId: "",
    parentPath: "",
    children: [],
    dir: "",
  };
  item.children = createEntities(item.id, `/${item.id} ${item.name}`, 2);
  item.dir = item.id;
  PlatformEntityMap[item.dir] = item;
  dirs.node.push(item);

  return dirs;
}

export const PlatformEntityList = createPlatformEntities();
