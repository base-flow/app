import { queryOptions } from "@tanstack/react-query";
import request from "@/utils/request";
import { sleep } from "@/utils/tools";

export const NodeAPI = {
  itemQueryKey: "NodeItem",
  npmInfoQueryKey: "NodeNpmInfo",
  getItem(id: string): Promise<_Node.INodeDetail> {
    return request.get(`/api/node/${id}`).then((res) => res.data);
  },
  updateItem(item: Partial<_Node.INodeDetail>): Promise<_Node.UpdateResult> {
    return request.put(`/api/node/${item.id}`, item).then((res) => res.data);
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
  // queryInfiniteList(query: _Node.Query = {}) {
  //   query = filterQuery(query);
  //   return {
  //     queryKey: [NodeAPI.listQueryKey, query] as any[],
  //     queryFn: ({ pageParam }: any) => NodeAPI.getList({ ...query, page: pageParam }),
  //     getNextPageParam: (lastPage: _Node.QueryResult) => {
  //       const { page, pageSize, total } = lastPage.summary;
  //       return page * pageSize < total ? page + 1 : undefined;
  //     },
  //     initialPageParam: 1,
  //     staleTime: Infinity,
  //     retry: 0,
  //     refetchOnWindowFocus: false,
  //     placeholderData: keepPreviousData,
  //   };
  // },
};
