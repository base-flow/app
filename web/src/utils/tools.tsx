import type { ReactNode } from "react";
import { API_PROXY, AUTH_TOKEN_KEY, HomePage, LoginPage } from "../const";
import { router } from "../router";

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export function getAuthToken(): string {
  return localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

export function isEmptyObject(obj: any): boolean {
  return obj ? Object.keys(obj).length === 0 : true;
}

export function replaceApiBase(url: string): string {
  return url.replace(/^\/(api)\//, (pre) => (API_PROXY as any)[pre]);
}

export function verifyFileName(name: string): string {
  if (!name) {
    return "文件名不能为空";
  }
  if (/[\s/]/.test(name)) {
    return "文件名中不能包含空格和/字符";
  }
  return "";
}

export function debounce<T extends (...rest: any[]) => any>(callbak: T, delay = 0, every?: T): T {
  let timer: any = null;
  return ((...args: any[]) => {
    every?.(...args);
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      callbak(...args);
      timer = null;
    }, delay);
  }) as any;
}

export function logined(token: string, auth: _App.AuthUser, redirect?: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  location.href = !redirect || redirect === "/" ? HomePage(auth.id) : redirect;
}

export function logouted(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  location.href = `${LoginPage}?redirect=${encodeURIComponent(router.state.location.href)}`;
}

export function filterQuery(query: { [key: string]: any }): { [key: string]: any } {
  return Object.keys(query).reduce(
    (obj, key) => {
      if (query[key] !== undefined) {
        obj[key] = query[key];
      }
      return obj;
    },
    {} as { [key: string]: any },
  );
}
export function arrayInsertSeparator(arr: any[], separator: any): any[] {
  return arr.reduce((result, item, index) => {
    result.push(item);
    if (index < arr.length - 1) {
      result.push(separator);
    }
    return result;
  }, []);
}

// function arrayInsertSeparator(arr: any[], separator: any): any[] {
//     return arr.flatMap((item, index) =>
//         index < arr.length - 1 ? [item, separator] : [item]
//     );
// }

export function deepEqual(a: any, b: any) {
  // 1. 引用或基本类型完全相等
  if (a === b) return true;
  // 2. 处理 null
  if (a === null || b === null) return a === b;
  // 3. 类型不同
  if (typeof a !== typeof b) return false;
  // 4. 非对象（number/string/boolean）
  if (typeof a !== "object") return false;
  // 5. Array 处理
  const isArrayA = Array.isArray(a);
  const isArrayB = Array.isArray(b);
  if (isArrayA !== isArrayB) return false;
  if (isArrayA) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  // 6. Object 处理
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false;
    }
    if (!deepEqual(a[key], b[key])) {
      return false;
    }
  }
  return true;
}

export function sortList<T extends { [key: string]: any }>(list: T[], sortField: string, sortOrder: "ascend" | "descend"): T[] {
  const factor = sortOrder === "ascend" ? 1 : -1;

  return [...list].sort((a, b) => {
    const v1: any = a[sortField];
    const v2: any = b[sortField];

    if (v1 == null && v2 == null) return 0;
    if (v1 == null) return -1 * factor;
    if (v2 == null) return 1 * factor;

    if (typeof v1 === "number" && typeof v2 === "number") {
      return (v1 - v2) * factor;
    }

    if (typeof v1 === "string" && typeof v2 === "string") {
      return v1.localeCompare(v2) * factor;
    }

    if (v1 instanceof Date && v2 instanceof Date) {
      return (v1.getTime() - v2.getTime()) * factor;
    }

    return String(v1).localeCompare(String(v2)) * factor;
  });
}

interface TreeData {
  key: string;
  title: string;
  children?: TreeData[];
}

export function findInTree<T extends TreeData>(tree: T, reduce: (item: T) => boolean | T | void): T | undefined {
  const result = reduce(tree);
  if (result) {
    return typeof result === "boolean" ? tree : result;
  }
  if (tree.children?.length) {
    const arr = tree.children;
    for (let i = 0, k = arr.length; i < k; i++) {
      const item = arr[i] as T;
      const result = findInTree(item as T, reduce);
      if (result) {
        return typeof result === "boolean" ? item : result;
      }
    }
  }
  return undefined;
}

export function messageWrap(message: string): ReactNode {
  const arr = message.split("\n");
  return arr.length > 1 ? arr.map((line) => <div key={line}>{line}</div>) : message;
}
// export function isDirectory(item: { type: string }): item is _App.IDirectory {
//   return item.type === "directory";
// }
// export function isWorkflow(item: { type: string }): item is _Workflow.IWorkflow {
//   return item.type === "workflow";
// }
export function openDirectory(
  entity: _Entity.IEntity,
  parentDir: boolean,
  navigate: (data: { to: string; search: { [key: string]: any } }) => void,
): void {
  const { id, spaceType, spaceId, parentId, path } = entity;
  let dir: string | undefined = parentDir ? parentId : id;
  if (parentDir && path.split("/").length === 3) {
    dir = undefined;
  }
  navigate({ to: `/${spaceType}/${spaceId}`, search: { dir } });
}
export function openFile(file: _Workflow.IWorkflow | _Node.INode | _Data.IData, windowKey: "EntityEdit" | "EntityView"): void {
  //window.open(`${window.BASE_PATH || ""}/${spaceType}/${spaceId}${dir}`, windowKey);
}
export function showPath(path: string, keepSelf?: boolean): string {
  //.replace(/\/.+? /g, "/").replace(/^\/.+?\//, "/").replace(/\/[^/]+?$/, "") || "/"
  const pathname = path.replace(/\/.+? /g, "/");
  return keepSelf ? pathname : pathname.replace(/\/[^/]+?$/, "") || "/";
}
export function isPublicDir(path: string): boolean {
  return /^\/[^/]+\/public/.test(path.replace(/\/.+? /g, "/"));
}
