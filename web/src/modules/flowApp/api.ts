import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import request from "@/utils/request";
import { filterQuery } from "@/utils/tools";

export const FlowAppAPI = {
  listQueryKey: "FlowAppList",
  itemQueryKey: "FlowAppItem",
  memberListQueryKey: "FlowAppMemberList",
  getList(query: FlowApp.IQuery): Promise<FlowApp.IQueryResult> {
    return request.get<FlowApp.IQueryResult>("/api/app", { params: query }).then((res) => res.data);
  },
  getItem(id: string): Promise<FlowApp.IApp> {
    return request.get<FlowApp.IApp>(`/api/app/${id}`).then((res) => res.data);
  },
  editItem(item: Partial<FlowApp.IApp>): Promise<FlowApp.ICreateResult | FlowApp.IUpdateResult> {
    if (item.id) {
      return request.put<FlowApp.IUpdateResult>(`/api/app/${item.id}`, item).then((res) => res.data);
    } else {
      return request.post<FlowApp.ICreateResult>("/api/app", item).then((res) => res.data);
    }
  },
  deleteItem(id: string): Promise<void> {
    return request.delete("/api/app", { params: { id } });
  },
  getMemberList(id: string): Promise<User.IQueryResult> {
    return request.get<User.IQueryResult>(`/api/app/${id}/member`).then((res) => res.data);
  },
  queryItem(id: string) {
    return queryOptions({
      queryKey: [FlowAppAPI.itemQueryKey, id],
      queryFn: () => FlowAppAPI.getItem(id),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
    });
  },
  queryList(query: FlowApp.IQuery = {}) {
    query = filterQuery(query);
    return queryOptions({
      queryKey: [FlowAppAPI.listQueryKey, query] as any[],
      queryFn: () => FlowAppAPI.getList(query),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  },
  queryMemberList(id: string) {
    return queryOptions({
      queryKey: [FlowAppAPI.memberListQueryKey, id],
      queryFn: () => FlowAppAPI.getMemberList(id),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  },
};
