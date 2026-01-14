import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import request from "@/utils/request";
import { filterQuery } from "@/utils/tools";

export const FlowAPI = {
  listQueryKey: "FlowList",
  itemQueryKey: "FlowItem",
  getList(query: Flow.IQuery): Promise<Flow.IQueryResult> {
    return request.get<Flow.IQueryResult>("/api/flow", { params: query }).then((res) => res.data);
  },
  getItem(id: string): Promise<Flow.IFlow> {
    return request.get<Flow.IFlow>(`/api/flow/${id}`).then((res) => res.data);
  },
  editItem(item: Partial<Flow.IFlow>): Promise<Flow.ICreateResult | Flow.IUpdateResult> {
    if (item.id) {
      return request.put<Flow.IUpdateResult>(`/api/flow/${item.id}`, item).then((res) => res.data);
    } else {
      return request.post<Flow.ICreateResult>("/api/flow", item).then((res) => res.data);
    }
  },
  deleteItem(id: string): Promise<void> {
    return request.delete(`/api/flow/${id}`);
  },
  batchDelete(ids: string[]): Promise<void> {
    return request.delete("/api/flow", { data: { ids } });
  },
  queryItem(id: string) {
    return queryOptions({
      queryKey: [FlowAPI.itemQueryKey, id],
      queryFn: () => FlowAPI.getItem(id),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
    });
  },
  queryList(query: Flow.IQuery) {
    query = filterQuery(query);
    return queryOptions({
      queryKey: [FlowAPI.listQueryKey, query],
      queryFn: () => FlowAPI.getList(query),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  },
};
