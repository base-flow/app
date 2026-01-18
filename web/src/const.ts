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

export const AppRoleOptions = [
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

export function GetAppRoleOptions(zone: "all" | "admin" | "dev"): { key: string; label: string; value: string }[] {
  if (zone === "all") {
    return AppRoleOptions;
  } else if (zone === "admin") {
    return AppRoleOptions.slice(1);
  } else if (zone === "dev") {
    return AppRoleOptions.slice(2);
  } else {
    return [];
  }
}

const AppRoleLevel: { [key in App.AppRole]: number } = {
  Owner: 5,
  Admin: 4,
  Developer: 3,
  Tester: 2,
  Member: 1,
};

export function AppRoleLower(zone: "all" | "admin" | "dev", target: App.AppRole): boolean {
  if (zone === "all") {
    return true;
  } else if (zone === "admin") {
    return AppRoleLevel.Owner > AppRoleLevel[target];
  } else if (zone === "dev") {
    return AppRoleLevel.Admin > AppRoleLevel[target];
  }
  return true;
}
