import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import request from "@/utils/request";
import { filterQuery } from "@/utils/tools";

export const NodeAPI = {
  listQueryKey: "NodeList",
  itemQueryKey: "NodeItem",
  getList(query: _Node.Query): Promise<_Node.QueryResult> {
    return request.get("/api/node", { params: query }).then((res) => res.data);
  },
  getItem(id: string): Promise<_Node.INode> {
    return request.get(`/api/node/${id}`).then((res) => res.data);
  },
  editItem(item: Partial<_Node.INode>): Promise<_Node.CreateResult | _Node.UpdateResult> {
    if (item.id) {
      return request.put(`/api/node/${item.id}`, item).then((res) => res.data);
    } else {
      return request.post("/api/node", item).then((res) => res.data);
    }
  },
  deleteItem(id: string): Promise<void> {
    return request.delete("/api/node", { params: { id } });
  },
  queryItem(id: string) {
    return queryOptions({
      queryKey: [NodeAPI.itemQueryKey, id],
      queryFn: () => NodeAPI.getItem(id),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
    });
  },
  queryList(query: _Node.Query = {}) {
    query = filterQuery(query);
    return queryOptions({
      queryKey: [NodeAPI.listQueryKey, query],
      queryFn: () => NodeAPI.getList(query),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  },
  queryInfiniteList(query: _Node.Query = {}) {
    query = filterQuery(query);
    return {
      queryKey: [NodeAPI.listQueryKey, query] as any[],
      queryFn: ({ pageParam }: any) => NodeAPI.getList({ ...query, page: pageParam }),
      getNextPageParam: (lastPage: _Node.QueryResult) => {
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
