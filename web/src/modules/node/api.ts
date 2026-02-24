import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import request from "@/utils/request";
import { filterQuery, sleep } from "@/utils/tools";

export const NodeAPI = {
  listQueryKey: "NodeList",
  itemQueryKey: "NodeItem",
  npmInfoQueryKey: "NodeNpmInfo",
  getList(query: _Node.Query): Promise<_Node.QueryResult> {
    return request.get("/api/node", { params: query }).then((res) => res.data);
  },
  getItem(id: string): Promise<_Node.INode> {
    return request.get(`/api/node/${id}`).then((res) => res.data);
  },
  async getNpmInfo(npm: string): Promise<_Node.NpmInfo> {
    await sleep(2000);
    return Promise.resolve({
      name: "条件分支",
      icon: "",
      runtime: "browser",
      kind: "trigger",
      desc: "条件分支：放置于[条件选择]中，通过设置执行条件来决定是否执行",
    });
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
  queryNpmInfo(npm: string) {
    return queryOptions({
      queryKey: [NodeAPI.npmInfoQueryKey, npm],
      queryFn: () => NodeAPI.getNpmInfo(npm),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
    });
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
