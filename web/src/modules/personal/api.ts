import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import request from "@/utils/request";

export const PersonalAPI = {
  itemQueryKey: "PersonalItem",
  getItem(username: string): Promise<_Personal.IPersonal> {
    return request.get(`/api/personal/${username}`).then((res) => res.data);
  },
  queryItem(id: string) {
    return queryOptions({
      queryKey: [PersonalAPI.itemQueryKey, id],
      queryFn: () => PersonalAPI.getItem(id),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
    });
  },
};
