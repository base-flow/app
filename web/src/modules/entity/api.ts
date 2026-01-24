import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import request from "@/utils/request";
import { filterQuery } from "@/utils/tools";

export const EntityAPI = {
  listQueryKey: "EntityList",
  itemQueryKey: "EntityItem",
  getList(query: _Entity.Query): Promise<_Entity.QueryResult> {
    return request.get("/api/entity", { params: query }).then((res) => res.data);
  },
  getItem(id: string): Promise<_Entity.IEntity> {
    return request.get(`/api/entity/${id}`).then((res) => res.data);
  },
  deleteItem(id: string): Promise<void> {
    return request.delete(`/api/entity/${id}`);
  },
  batchDelete(ids: string[]): Promise<void> {
    return request.delete("/api/entity", { data: { ids } });
  },
  createItem(item: Partial<_Entity.IEntity>): Promise<_Entity.CreateResult> {
    return request.post("/api/entity", item).then((res) => res.data);
  },
  updateItem(item: Partial<_Entity.IEntity>): Promise<_Entity.UpdateResult> {
    return request.put(`/api/entity/${item.id}`, item).then((res) => res.data);
  },
  queryItem(id: string) {
    return queryOptions({
      queryKey: [EntityAPI.itemQueryKey, id],
      queryFn: () => EntityAPI.getItem(id),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
    });
  },
  queryList(query: _Entity.Query) {
    query = filterQuery(query);
    return queryOptions({
      queryKey: [EntityAPI.listQueryKey, query],
      queryFn: () => EntityAPI.getList(query),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  },
};
