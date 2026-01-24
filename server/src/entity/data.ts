import { randomInt } from "@/utils";

const Mock = require("mockjs");
var Random = Mock.Random;

let uid = 1;

function createEntities(parent: string, path: string, level: number) {
  const dirs: _Entity.IEntity[] = new Array(3).fill("").map(() => {
    const item: _App.IDirectory = {
      id: `_${uid++}`,
      type: "directory",
      name: Random.ctitle(10, 20),
      desc: Random.csentence(20, 60),
      parent,
      path,
      children: [],
    };
    if (level > 0) {
      item.children = createEntities(item.id, `${path}${item.name}/`, level - 1);
    }
    return item;
  });
  const items: _Entity.IEntity[] = new Array(10).fill("").map(() => {
    const int = randomInt(1, 2);
    if (int === 2) {
      const item: _Workflow.IWorkflow = {
        id: `_${uid++}`,
        type: "workflow",
        name: Random.ctitle(10, 20),
        desc: Random.csentence(20, 60),
        parent,
        path,
        runtime: Random.pick(["server", "browser"]),
      };
      return item;
    } else {
      const item: _Node.INode = {
        id: `_${uid++}`,
        type: "node",
        name: Random.ctitle(10, 20),
        desc: Random.csentence(20, 60),
        parent,
        path,
        runtime: Random.pick(["server", "browser"]),
        nodeType: Random.pick(["executor", "trigger"]),
        icon: "",
        package: "@baseflow/aaa",
        content: "",
        version: "2.5.12",
        likes: 23,
      };
      return item;
    }
  });
  return dirs.concat(items);
}

export const EntityList = createEntities("/", "/", 2);
