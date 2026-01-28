declare namespace _Personal {
  interface IPersonal extends _Resource.IItem {
    username: string;
    nickname: string;
    dir: string;
    publicDir: string;
    totalWorkflows: number;
    totalNodes: number;
  }
}
