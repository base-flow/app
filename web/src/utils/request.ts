/** biome-ignore-all lint/complexity/noBannedTypes: <> */

import { BaseWidgets } from "@baseflow/react";
import axios from "redaxios";
import { API_PROXY } from "./const";
import { getAuthToken, isEmptyObject } from "./tools";

export interface IRequest<Req, Res> {
  Request: Req;
  Response: Res;
}

const instance = axios.create();

export function replaceBaseUrl(url: string): string {
  return url.replace(/^\/(api)\//, (pre) => API_PROXY[pre]);
}

// instance.defaults.withCredentials = true;

function onRequestSuccess(res: { data: any }) {
  return res.data;
}
function onRequestError(res: { status: number; url: string; config: { method: string; headers?: { [key: string]: string } }; data: any }) {
  // console.log(res);
  const { status = "500", url, data = {}, config } = res;
  if (!config || !config.headers?.quite) {
    BaseWidgets.message.error(data.message || `(${status})请求${url}失败！`);
  }
  throw new Error(`(${status})${url}`);
}

export const request = {
  get<R, T extends { [key: string]: string } = {}>(url: string, params?: T, headers?: { [key: string]: string }): Promise<R> {
    return instance
      .get(replaceBaseUrl(url), {
        params: isEmptyObject(params) ? undefined : params,
        headers: { Authorization: `Bearer ${getAuthToken()}`, ...headers },
      })
      .then(onRequestSuccess, onRequestError);
  },
  post<R, T extends { [key: string]: string } = {}>(url: string, body?: T, headers?: { [key: string]: string }): Promise<R> {
    return instance
      .post(replaceBaseUrl(url), body, {
        headers: { Authorization: `Bearer ${getAuthToken()}`, "Content-type": "application/json;charset=utf-8", ...headers },
      })
      .then(onRequestSuccess, onRequestError);
  },
  put<R, T extends { [key: string]: string } = {}>(url: string, body?: T, headers?: { [key: string]: string }): Promise<R> {
    return instance
      .put(replaceBaseUrl(url), body, {
        headers: { Authorization: `Bearer ${getAuthToken()}`, "Content-type": "application/json;charset=utf-8", ...headers },
      })
      .then(onRequestSuccess, onRequestError);
  },
  del<R, T extends { [key: string]: string } = {}>(url: string, params?: T, headers?: { [key: string]: string }): Promise<R> {
    return instance
      .delete(replaceBaseUrl(url), {
        params: isEmptyObject(params) ? undefined : params,
        headers: { Authorization: `Bearer ${getAuthToken()}`, "Content-type": "application/json;charset=utf-8", ...headers },
      })
      .then(onRequestSuccess, onRequestError);
  },
};

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
