// @ts-expect-error
export const API_PROXY = (window.API_PROXY || (import.meta.env.VITE_API_PROXY as string)).split(",").reduce(
  (obj, item) => {
    const [from, to] = item.split("=>");
    if (from && to) {
      obj[from.trim()] = to.trim();
    }
    return obj;
  },
  {} as { [key: string]: string },
);
export const AUTH_TOKEN_KEY = "_baseflow_auth_token_key_";
export const PAGE_SIZE_OPTIONS = ["20", "50", "100"];
