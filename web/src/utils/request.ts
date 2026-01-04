import { BaseWidgets } from "@baseflow/react";
import axios, { type AxiosError, type AxiosResponse } from "axios";
import { API_PROXY } from "./const";
import { getAuthToken } from "./tools";

export interface IRequest<Req, Res> {
  Request: Req;
  Response: Res;
}

export function replaceBaseUrl(url: string): string {
  return url.replace(/^\/(api)\//, (pre) => API_PROXY[pre]);
}

function toErrorMessage(status: number) {
  switch (status) {
    case 400:
      return "请求错误:请求参数错误";
    case 401:
      return "登录失效";
    case 403:
      return "禁止访问:您没有权限访问改资源";
    case 404:
      return "未找到:请求的资源不存在";
    case 500:
      return "服务器错误:请稍后重试";
    case 502:
      return "服务器错误:请求超时";
    default:
      return "请求错误:发生未知错误";
  }
}

const instance = axios.create({
  timeout: 60 * 1000 * 5,
});

instance.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${getAuthToken()}`;
  req.url = replaceBaseUrl(req.url!);
  // if (req.method === "post") {
  //   if (!req.data) {
  //     req.data = {};
  //   }
  // }
  return req;
});

// instance.defaults.withCredentials = true;

instance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return response;
  },
  (error: AxiosError<{ message: string }>) => {
    const config = error.config!;
    const requestHeaders = config.headers;
    const response: any = error.response || {};
    const httpErrorCode = response.status || 0;
    const data: any = response.data || {};
    // if (httpErrorCode === 401) {
    //   clearToken();
    //   throw new CustomError(mapHttpErrorCode(httpErrorCode), "请登录！");
    // } else if (httpErrorCode === 402) {
    //   // info(data.message || '检测到租户已发生变化，需要刷新数据...', () => {
    //   //   window.location.href = SitesUrl.verse;
    //   // });
    // }

    const requestUrl = config.url;
    const errorMessage = `${toErrorMessage(httpErrorCode)}(${data.message || requestUrl}）`;
    if (httpErrorCode && !requestHeaders.Quiet) {
      BaseWidgets.message.error(errorMessage);
    }
    throw new Error(`(${httpErrorCode})${requestUrl}`);
  },
);

export default instance;

// export const request = {
//   get<R, T extends { [key: string]: string } = {}>(url: string, params?: T, headers?: { [key: string]: string }): Promise<R> {
//     return instance
//       .get(replaceBaseUrl(url), {
//         params: isEmptyObject(params) ? undefined : params,
//         headers: { Authorization: `Bearer ${getAuthToken()}`, ...headers },
//       })
//       .then(onRequestSuccess, onRequestError);
//   },
//   post<R, T extends { [key: string]: string } = {}>(url: string, body?: T, headers?: { [key: string]: string }): Promise<R> {
//     return instance
//       .post(replaceBaseUrl(url), body, {
//         headers: { Authorization: `Bearer ${getAuthToken()}`, "Content-type": "application/json;charset=utf-8", ...headers },
//       })
//       .then(onRequestSuccess, onRequestError);
//   },
//   put<R, T extends { [key: string]: string } = {}>(url: string, body?: T, headers?: { [key: string]: string }): Promise<R> {
//     return instance
//       .put(replaceBaseUrl(url), body, {
//         headers: { Authorization: `Bearer ${getAuthToken()}`, "Content-type": "application/json;charset=utf-8", ...headers },
//       })
//       .then(onRequestSuccess, onRequestError);
//   },
//   del<R, T extends { [key: string]: string } = {}>(url: string, params?: T, headers?: { [key: string]: string }): Promise<R> {
//     return instance
//       .delete(replaceBaseUrl(url), {
//         params: isEmptyObject(params) ? undefined : params,
//         headers: { Authorization: `Bearer ${getAuthToken()}`, "Content-type": "application/json;charset=utf-8", ...headers },
//       })
//       .then(onRequestSuccess, onRequestError);
//   },
// };

// instance.interceptors.request.use((req) => {
//   const token = getToken();
//   if (token) {
//     req.headers.Authorization = token;
//   }
//   req.url = replaceBaseUrl(req.url!);
//   if (req.method === 'post') {
//     if (!req.data) {
//       req.data = {};
//     }
//     // if (!req.data.agencyID) {
//     //   req.data.agencyID = parseInt(agencyID);
//     // }
//   }
//   return req;
// });
export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
