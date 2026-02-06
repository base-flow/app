import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import request from "@/utils/request";

export const SharedAPI = {
  listQueryKey: "SharedList",
  gotListQueryKey: "GotSharedList",
  contentListQueryKey: "SharedContentList",
  itemQueryKey: "SharedItem",

  getList(query: _Shared.Query): Promise<_Shared.IShared[]> {
    return request.get("/api/shared", { params: query }).then((res) => res.data);
  },
  getGotList(): Promise<_Shared.IGotShared[]> {
    return request.get("/api/gotShared").then((res) => res.data);
  },
  getContentList(id: string, query: _Entity.Query): Promise<_Entity.QueryResult> {
    return request.get(`/api/shared/${id}/content`, { params: query }).then((res) => res.data);
  },
  getItem(id: string): Promise<_Shared.IShared> {
    return request.get(`/api/shared/${id}`).then((res) => res.data);
  },
  deleteItem(id: string): Promise<void> {
    return request.delete("/api/shared", { params: { id } });
  },
  deleteGotItem(id: string): Promise<void> {
    return request.delete("/api/gotShared", { params: { id } });
  },
  deleteContentItem(id: string): Promise<void> {
    return request.delete(`/api/shared/${id}/content`);
  },
  batchDeleteContentItem(args: { sharedId: string; entityIds: string[] }): Promise<void> {
    return request.delete(`/api/shared/${args.sharedId}/content`, { data: { ids: args.entityIds } });
  },
  batchPutContentItem(args: { sharedId: string; entityIds: string[] }): Promise<void> {
    return request.put(`/api/shared/${args.sharedId}/content`, { data: { ids: args.entityIds } });
  },
  queryList(query: _Shared.Query) {
    return queryOptions({
      queryKey: [SharedAPI.listQueryKey, query],
      queryFn: () => SharedAPI.getList(query),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  },
  queryGotList() {
    return queryOptions({
      queryKey: [SharedAPI.gotListQueryKey],
      queryFn: () => SharedAPI.getGotList(),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  },
  queryContentList(id: string, query: _Entity.Query) {
    return queryOptions({
      queryKey: [SharedAPI.contentListQueryKey, id],
      queryFn: () => SharedAPI.getContentList(id, query),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  },
  queryItem(id: string) {
    return queryOptions({
      queryKey: [SharedAPI.itemQueryKey, id],
      queryFn: () => SharedAPI.getItem(id),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
    });
  },
};
