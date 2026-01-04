import { AUTH_TOKEN_KEY } from "./const";

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export function getAuthToken(): string {
  return localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

export function getUserRedirect(redirect?: string): string {
  return !redirect || redirect === "/" ? "/dashboard" : redirect;
}

export function isEmptyObject(obj: any): boolean {
  return obj ? Object.keys(obj).length === 0 : true;
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
