import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import request from "@/utils/request";
import { filterQuery } from "@/utils/tools";

export const FlowNodeAPI = {
  listQueryKey: "FlowNodeList",
  itemQueryKey: "FlowNodeItem",
  getList(query: FlowNode.IQuery): Promise<FlowNode.IQueryResult> {
    return request.get<FlowNode.IQueryResult>("/api/node", { params: query }).then((res) => res.data);
  },
  getItem(id: string): Promise<FlowNode.INode> {
    return request.get<FlowNode.INode>(`/api/node/${id}`).then((res) => res.data);
  },
  editItem(item: Partial<FlowNode.INode>): Promise<FlowNode.ICreateResult | FlowNode.IUpdateResult> {
    if (item.id) {
      return request.put<FlowNode.IUpdateResult>(`/api/node/${item.id}`, item).then((res) => res.data);
    } else {
      return request.post<FlowNode.ICreateResult>("/api/node", item).then((res) => res.data);
    }
  },
  deleteItem(id: string): Promise<void> {
    return request.delete("/api/node", { params: { id } });
  },
  queryItem(id: string) {
    return queryOptions({
      queryKey: [FlowNodeAPI.itemQueryKey, id],
      queryFn: () => FlowNodeAPI.getItem(id),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
    });
  },
  queryList(query: FlowNode.IQuery = {}) {
    query = filterQuery(query);
    return queryOptions({
      queryKey: [FlowNodeAPI.listQueryKey, query],
      queryFn: () => FlowNodeAPI.getList(query),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  },
  queryInfiniteList(query: FlowNode.IQuery = {}) {
    query = filterQuery(query);
    return {
      queryKey: [FlowNodeAPI.listQueryKey, query] as any[],
      queryFn: ({ pageParam }: any) => FlowNodeAPI.getList({ ...query, page: pageParam }),
      getNextPageParam: (lastPage: FlowNode.IQueryResult) => {
        const { page, pageSize, total } = lastPage.summary;
        return page * pageSize < total ? page + 1 : undefined;
      },
      initialPageParam: 1,
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    };
  },
};
