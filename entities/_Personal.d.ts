declare namespace _Personal {
  interface IPersonal extends _Resource.IItem {
    username: string;
    nickname: string;
    dir: string;
    publicDir: string;
    totalItems: number;
    totalWorkflows: number;
    totalNodes: number;
    totalPublics: number;
  }
}
