import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import request from "@/utils/request";

export const FavoriteAPI = {
  idsQueryKey: "FavoriteIds",
  listQueryKey: "FavoriteList",
  getList(): Promise<_Entity.IEntity[]> {
    return request.get("/api/favorite").then((res) => res.data);
  },
  getIds(): Promise<string[]> {
    return request.get("/api/favorite/ids").then((res) => res.data);
  },
  batchUpdate(items: { ids: string[]; fav: boolean }): Promise<void> {
    return request.put(`/api/favorite`, items).then((res) => res.data);
  },
  queryIds() {
    return queryOptions({
      queryKey: [FavoriteAPI.idsQueryKey],
      queryFn: () => FavoriteAPI.getIds(),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  },
  queryList() {
    return queryOptions({
      queryKey: [FavoriteAPI.listQueryKey],
      queryFn: () => FavoriteAPI.getList(),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  },
};
