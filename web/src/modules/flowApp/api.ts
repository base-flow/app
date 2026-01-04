import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import request from "@/utils/request";

export const FlowAppAPI = {
  listQueryKey: "flowAppList",
  itemQueryKey: "flowAppItem",
  getList(query: FlowApp.IQuery): Promise<FlowApp.IQueryResult> {
    return request.get<FlowApp.IQueryResult>("/api/apps", { params: query }).then((res) => res.data);
  },
  getItem(id: string): Promise<FlowApp.IApp> {
    return request.get<FlowApp.IApp>(`/api/apps/${id}`).then((res) => res.data);
  },
  editItem(item: Partial<FlowApp.IApp>): Promise<FlowApp.ICreateResult | FlowApp.IUpdateResult> {
    if (item.id) {
      return request.put<FlowApp.IUpdateResult>(`/api/apps/${item.id}`, item).then((res) => res.data);
    } else {
      return request.post<FlowApp.ICreateResult>("/api/apps", item).then((res) => res.data);
    }
  },
  deleteItem(id: string): Promise<void> {
    return request.delete("/api/apps", { params: { id } });
  },
  // eslint-disable-next-line ts/explicit-module-boundary-types
  queryItem(id: string) {
    return queryOptions({
      queryKey: [FlowAppAPI.itemQueryKey, id],
      queryFn: () => FlowAppAPI.getItem(id),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
    });
  },
  // eslint-disable-next-line ts/explicit-module-boundary-types
  queryList(query: FlowApp.IQuery = {}, guest?: boolean) {
    return queryOptions({
      queryKey: [FlowAppAPI.listQueryKey, query],
      queryFn: () => FlowAppAPI.getList(query),
      enabled: !guest,
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  },
};
