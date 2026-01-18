declare namespace FlowApp {
  type AppRole = "Owner" | "Admin" | "Developer" | "Tester" | "Member";

  interface IQuery extends App.IQuery {}

  interface IApp extends App.IResource {
    name: string;
    desc: string;
    logo: string;
    updateDate: string;
    collected?: boolean;
    totalFlows: number;
    flowsNumber: {
      [key in App.Runtime]: number;
    };
  }

  type IQueryResult = App.IQueryResult<IApp, IQuery>;

  type ICreateResult = App.ICreateResult;

  type IUpdateResult = App.IUpdateResult;

  interface IMember {
    id: string;
    username: string;
    nickname: string;
    appRole: AppRole;
  }

  type IMemberQueryResult = IMember[];
  interface ICreateMemberData {
    id: string;
    role: AppRole;
  }

  // interface IApplyMemberData {
  //   appId: string;
  //   role: AppRole;
  //   reason: string;
  // }
}
