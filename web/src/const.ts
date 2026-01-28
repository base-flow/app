declare const __API_PROXY__: string;

export const LoginPage = "/login";

export const API_PROXY: { "/i18n/": string; "/api/": string } = (window.API_PROXY || __API_PROXY__).split(",").reduce((obj, item) => {
  const [from, to] = item.split("=>");
  if (from && to) {
    obj[from.trim()] = to.trim();
  }
  return obj;
}, {} as any);
export const AUTH_TOKEN_KEY = "_baseflow_auth_token_key_";
export const PAGE_SIZE_OPTIONS = ["20", "50", "100"];
export const LOCALE_KEY = "_baseflow_locale_key_";

export function HomePage(userid: string): string {
  return `/personal/${userid}`;
}

export const DomIds = {
  Button_CreateNode: "_Button_CreateNode_",
  Button_CreateNodeFolder: "_Button_CreateNodeFolder_",
};

export const ProjectRoleOptions = [
  {
    key: "Owner",
    label: "Owner",
    value: "Owner",
  },
  {
    key: "Admin",
    label: "Admin",
    value: "Admin",
  },
  {
    key: "Developer",
    label: "Developer",
    value: "Developer",
  },
  {
    key: "Tester",
    label: "Tester",
    value: "Tester",
  },
  {
    key: "Member",
    label: "Member",
    value: "Member",
  },
];

export function GetProjectRoleOptions(scope: _Permission.ProjectAssignUserScope): { key: string; label: string; value: string }[] {
  if (scope === "all") {
    return ProjectRoleOptions;
  } else if (scope === "admin") {
    return ProjectRoleOptions.slice(1);
  } else if (scope === "dev") {
    return ProjectRoleOptions.slice(2);
  } else {
    return [];
  }
}

const ProjectRoleLevel: { [key in _Permission.ProjectRole]: number } = {
  Owner: 5,
  Admin: 4,
  Developer: 3,
  Tester: 2,
  Member: 1,
};

export function ProjectRoleLowerThan(scope: _Permission.ProjectAssignUserScope, than: _Permission.ProjectRole): boolean {
  if (scope === "all") {
    return true;
  } else if (scope === "admin") {
    return ProjectRoleLevel.Owner > ProjectRoleLevel[than];
  } else if (scope === "dev") {
    return ProjectRoleLevel.Admin > ProjectRoleLevel[than];
  }
  return true;
}
