import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import request from "@/utils/request";
import { filterQuery } from "@/utils/tools";

export const UserAPI = {
  listQueryKey: "UserList",
  itemQueryKey: "UserItem",
  getList(query: _User.Query): Promise<_User.QueryResult> {
    return request.get("/api/user", { params: query }).then((res) => res.data);
  },
  queryList(query: _User.Query) {
    query = filterQuery(query);
    return queryOptions({
      queryKey: [UserAPI.listQueryKey, query],
      queryFn: () => UserAPI.getList(query),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  },
};
