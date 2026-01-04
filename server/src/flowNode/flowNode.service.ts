import { Injectable, NotFoundException } from "@nestjs/common";

const mockjs = require("mockjs");

let UID = 1000;
const actuatorList2: FlowNode.INode[] = mockjs
  .mock({
    "list|50": [
      {
        "id|+1": 1,
        type: "actuator",
        name: "@ctitle(10, 20)",
        logo: "",
        vers: ["2.0.0", "1.0.0"],
        desc: "@csentence(20, 60)",
        updateDate: "@datetime",
      },
    ],
  })
  .list.map((item: any) => ({ ...item, id: `${item.id}` }));

actuatorList2.unshift(
  {
    id: `${UID++}`,
    type: "actuator",
    name: "条件选择",
    icon: "",
    desc: "根据不同条件选择执行分支",
    content: JSON.stringify({
      nodes: [
        { tag: "@baseflow-nodes/choice", id: "choice1", childrenIds: ["branch1", "branch2"] },
        { tag: "@baseflow-nodes/branch", id: "branch1", parentId: "choice1" },
        { tag: "@baseflow-nodes/branch", id: "branch2", parentId: "choice1" },
      ],
      sources: {
        "@baseflow-nodes/choice": "@baseflow-nodes/choice",
        "@baseflow-nodes/branch": "@baseflow-nodes/branch",
      },
    }),
    vers: ["1.0.0", "1.0.1"],
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
  },
  {
    id: `${UID++}`,
    type: "actuator",
    name: "迭代Foreach",
    icon: "",
    desc: "对Array或Map中的元素迭代",
    content: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/foreach" }],
      sources: { "@baseflow-nodes/foreach": "@baseflow-nodes/foreach" },
    }),
    vers: ["1.0.0", "1.0.1"],
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
  },
  {
    id: `${UID++}`,
    type: "actuator",
    name: "Continue循环",
    icon: "",
    desc: "放置于[循环]节点中，跳过本次循环，继续下一次循环",
    content: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/continue" }],
      sources: { "@baseflow-nodes/continue": "@baseflow-nodes/continue" },
    }),
    vers: ["1.0.0", "1.0.1"],
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
  },
  {
    id: `${UID++}`,
    type: "actuator",
    name: "Break循环",
    icon: "",
    desc: "放置于[循环]节点中，退出整个循环",
    content: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/break" }],
      sources: { "@baseflow-nodes/break": "@baseflow-nodes/break" },
    }),
    vers: ["1.0.0", "1.0.1"],
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
  },
  {
    id: `${UID++}`,
    type: "actuator",
    name: "TryCatch",
    icon: "",
    desc: "提供一个可以捕获子节点运行时错误的容器节点",
    content: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/try-catch" }],
      sources: { "@baseflow-nodes/try-catch": "@baseflow-nodes/try-catch" },
    }),
    vers: ["1.0.0", "1.0.1"],
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
  },
  {
    id: `${UID++}`,
    type: "actuator",
    name: "task任务",
    icon: "",
    desc: "task任务",
    content: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/task" }],
      sources: { "@baseflow-nodes/task": "@baseflow-nodes/task" },
    }),
    vers: ["1.0.0", "1.0.1"],
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
  },
  {
    id: `${UID++}`,
    type: "actuator",
    name: "变量定义",
    icon: "",
    desc: "变量定义",
    content: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/variable" }],
      sources: { "@baseflow-nodes/variable": "@baseflow-nodes/variable" },
    }),
    vers: ["1.0.0", "1.0.1"],
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
  },
  {
    id: `${UID++}`,
    type: "actuator",
    name: "变量修改",
    icon: "",
    desc: "变量修改",
    content: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/variable-update" }],
      sources: { "@baseflow-nodes/variable-update": "@baseflow-nodes/variable-update" },
    }),
    vers: ["1.0.0", "1.0.1"],
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
  },
  {
    id: `${UID++}`,
    type: "actuator",
    name: "流程返回",
    icon: "",
    keywords: "",
    desc: "流程返回",
    content: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/return" }],
      sources: { "@baseflow-nodes/return": "@baseflow-nodes/return" },
    }),
    vers: ["1.0.0", "1.0.1"],
    likes: 20,
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
  },
);

const triggerList2: FlowNode.INode[] = mockjs
  .mock({
    "list|50": [
      {
        "id|+1": 100,
        type: "trigger",
        name: "@ctitle(10, 20)",
        logo: "",
        vers: ["2.0.0", "1.0.0"],
        desc: "@csentence(20, 60)",
        updateDate: "@datetime",
      },
    ],
  })
  .list.map((item: any) => ({ ...item, id: `${item.id}` }));

triggerList2.unshift({
  id: `${UID++}`,
  type: "trigger",
  name: "Webhook触发器",
  desc: "通过发送Http请求触发流程",
  content: JSON.stringify({
    nodes: [{ tag: "@baseflow-nodes/trigger-webhook" }],
    sources: { "@baseflow-nodes/trigger-webhook": "@baseflow-nodes/trigger-webhook" },
  }),
  vers: ["1.0.0", "1.0.1"],
  icon: "",
  updateDate: "",
  createDate: "",
  createBy: "",
  updateBy: "",
  isSystem: true,
});

const actuatorList1: FlowNode.INode[] = [
  {
    id: `Base`,
    type: "actuator",
    name: "基础逻辑节点",
    desc: "",
    vers: [],
    content: "",
    icon: "",
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
    isSystem: true,
    isFolder: true,
  },
  {
    id: `Database`,
    type: "actuator",
    name: "数据库操作",
    desc: "",
    vers: [],
    content: "",
    icon: "",
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
    isSystem: true,
    isFolder: true,
  },
  {
    id: `NetRequest`,
    type: "actuator",
    name: "HTTP请求",
    icon: "",
    desc: "发送HTTP请求",
    keywords: "",
    content: JSON.stringify({
      nodes: [{ tag: "@baseflow-nodes/http" }],
      sources: { "@baseflow-nodes/http": "@baseflow-nodes/http" },
    }),
    vers: ["1.0.0", "1.0.1"],
    likes: 20,
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
  },
];

const triggerList1: FlowNode.INode[] = [
  {
    id: `Webhook`,
    type: "trigger",
    name: "Webhook触发器",
    desc: "通过发送Http请求触发流程",
    vers: [],
    content: "",
    icon: "",
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
    isSystem: true,
    isFolder: true,
  },
  {
    id: `${UID++}`,
    type: "trigger",
    name: "定时任务触发器",
    desc: "通过设置定时任务触发流程",
    vers: [],
    content: "",
    icon: "",
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
    isSystem: true,
    isFolder: true,
  },
  {
    id: `${UID++}`,
    type: "trigger",
    name: "MQ消息队列触发器",
    desc: "通过消息的发布/订阅触发流程",
    vers: [],
    content: "",
    icon: "",
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
    isSystem: true,
    isFolder: true,
  },
  {
    id: `${UID++}`,
    type: "trigger",
    name: "STDIO进程触发器",
    desc: "通过进程管道stdio触发流程",
    vers: [],
    content: "",
    icon: "",
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
    isSystem: true,
    isFolder: true,
  },
  {
    id: `${UID++}`,
    type: "trigger",
    name: "gRPC触发器",
    desc: "通过RPC协议触发流程",
    vers: [],
    content: "",
    icon: "",
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
    isSystem: true,
    isFolder: true,
  },
  {
    id: `${UID++}`,
    type: "trigger",
    name: "数据库触发器",
    desc: "通过数据库CDC触发流程",
    vers: [],
    content: "",
    icon: "",
    updateDate: "",
    createDate: "",
    createBy: "",
    updateBy: "",
    isSystem: true,
    isFolder: true,
  },
];

const branchNode: FlowNode.INode = {
  id: `${UID++}`,
  type: "actuator",
  name: "条件分支",
  icon: "",
  desc: "定义条件选择的分支和执行条件",
  content: JSON.stringify({
    nodes: [{ tag: "@baseflow-nodes/branch" }],
    sources: { "@baseflow-nodes/branch": "@baseflow-nodes/branch" },
  }),
  vers: ["1.0.0", "1.0.1"],
  updateDate: "",
  createDate: "",
  createBy: "",
  updateBy: "",
};

// http://localhost:4873/-/verdaccio/data/search/@baseflow-nodes-private
@Injectable()
export class FlowNodeService {
  async findAll(query: FlowNode.IQuery): Promise<FlowNode.IQueryResult> {
    let result: FlowNode.INode[] = [];
    let path: [string, string][] | undefined;
    if (query.type === "actuator") {
      if (query.parent === "Choice") {
        result = [branchNode];
      } else if (query.parent === "Base") {
        result = actuatorList2;
        path = [["Base", "基础逻辑节点"]];
      } else {
        result = actuatorList1;
      }
    } else if (query.type === "trigger") {
      if (query.parent === "Webhook") {
        result = triggerList2;
        path = [["Webhook", "Webhook触发器"]];
      } else {
        result = triggerList1;
      }
    }
    const { page = 1, pageSize = 10 } = query;
    return { query, list: result.slice((page - 1) * pageSize, page * pageSize), summary: { total: result.length, page, pageSize, path } };
  }

  async createItem(userId: string, data: FlowNode.INode): Promise<FlowNode.ICreateResult> {
    // const newItem: FlowNode.INode = { ...data, id: `${Date.now()}`, updateDate: `${Date.now()}` };
    // list.unshift(newItem);
    return { id: "" };
  }

  async updateItem(userId: string, id: string, data: FlowNode.INode): Promise<FlowNode.IUpdateResult> {
    // const item = list.find(item => item.id === id);
    // if (!item) {
    //   throw new NotFoundException(`Node[${id}]不存在`);
    // }
    // Object.assign(item, data, { updateDate: `${Date.now()}` });
    return { id };
  }

  async deleteItem(id: string): Promise<void> {
    // list.splice(list.findIndex(item => item.id === id), 1);
  }

  async findOne(id: string): Promise<FlowNode.INode> {
    throw new NotFoundException(`Node[${id}]不存在`);
    // const item = list.find(item => item.id === id);
    // if (!item) {
    //   throw new NotFoundException(`Node[${id}]不存在`);
    // }
    // return item;
  }
}
