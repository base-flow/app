import { queryOptions } from "@tanstack/react-query";
import request from "@/utils/request";

export const DataAPI = {
  itemQueryKey: "DataItem",
  getItem(id: string): Promise<_Data.IDataDetail> {
    return request.get(`/api/data/${id}`).then((res) => res.data);
  },
  updateItem(item: Partial<_Data.IDataDetail>): Promise<_Data.UpdateResult> {
    return request.put(`/api/data/${item.id}`, item).then((res) => res.data);
  },
  queryItem(id: string) {
    return queryOptions({
      queryKey: [DataAPI.itemQueryKey, id],
      queryFn: () => DataAPI.getItem(id),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
    });
  },
};
