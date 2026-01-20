import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import request from "@/utils/request";
import { filterQuery } from "@/utils/tools";

export const WorkflowAPI = {
  listQueryKey: "WorkflowList",
  itemQueryKey: "WorkflowItem",
  getList(query: _Workflow.Query): Promise<_Workflow.QueryResult> {
    return request.get("/api/workflow", { params: query }).then((res) => res.data);
  },
  getItem(id: string): Promise<_Workflow.IWorkflow> {
    return request.get(`/api/workflow/${id}`).then((res) => res.data);
  },
  editItem(item: Partial<_Workflow.IWorkflow>): Promise<_Workflow.CreateResult | _Workflow.UpdateResult> {
    if (item.id) {
      return request.put(`/api/workflow/${item.id}`, item).then((res) => res.data);
    } else {
      return request.post("/api/workflow", item).then((res) => res.data);
    }
  },
  deleteItem(id: string): Promise<void> {
    return request.delete(`/api/workflow/${id}`);
  },
  batchDelete(ids: string[]): Promise<void> {
    return request.delete("/api/workflow", { data: { ids } });
  },
  queryItem(id: string) {
    return queryOptions({
      queryKey: [WorkflowAPI.itemQueryKey, id],
      queryFn: () => WorkflowAPI.getItem(id),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
    });
  },
  queryList(query: _Workflow.Query) {
    query = filterQuery(query);
    return queryOptions({
      queryKey: [WorkflowAPI.listQueryKey, query],
      queryFn: () => WorkflowAPI.getList(query),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  },
};
