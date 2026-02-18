import { queryOptions } from "@tanstack/react-query";
import request from "@/utils/request";

export const WorkflowAPI = {
  itemQueryKey: "WorkflowItem",
  getItem(id: string): Promise<_Workflow.IWorkflowItem> {
    return request.get(`/api/workflow/${id}`).then((res) => res.data);
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
};
