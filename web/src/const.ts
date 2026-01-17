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
    key: "Guest",
    label: "Guest",
    value: "Guest",
  },
];
