import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import request from "@/utils/request";
import { filterQuery } from "@/utils/tools";

export const ProjectAPI = {
  listQueryKey: "ProjectList",
  itemQueryKey: "ProjectItem",
  memberListQueryKey: "ProjectMemberList",
  getList(query: _Project.Query): Promise<_Project.QueryResult> {
    return request.get("/api/project", { params: query }).then((res) => res.data);
  },
  getItem(id: string): Promise<_Project.IProject> {
    return request.get(`/api/project/${id}`).then((res) => res.data);
  },
  editItem(item: Partial<_Project.IProject>): Promise<_Project.CreateResult | _Project.UpdateResult> {
    if (item.id) {
      return request.put<_Project.UpdateResult>(`/api/project/${item.id}`, item).then((res) => res.data);
    } else {
      return request.post<_Project.CreateResult>("/api/project", item).then((res) => res.data);
    }
  },
  deleteItem(id: string): Promise<void> {
    return request.delete("/api/project", { params: { id } });
  },
  getMemberList(projectId: string): Promise<_Project.IMember[]> {
    return request.get(`/api/project/${projectId}/member`).then((res) => res.data);
  },
  createMember(data: { projectId: string; member: Partial<_Project.IMember> }): Promise<_Project.IMember> {
    return request.post(`/api/project/${data.projectId}/member`, data.member).then((res) => res.data);
  },
  updateMember(data: { projectId: string; member: Partial<_Project.IMember> }): Promise<void> {
    return request.put(`/api/project/${data.projectId}/member`, data.member);
  },
  deleteMemberItem(data: { projectId: string; memberId: string }): Promise<void> {
    return request.delete(`/api/project/${data.projectId}/member`, { params: { id: data.memberId } });
  },
  queryItem(id: string) {
    return queryOptions({
      queryKey: [ProjectAPI.itemQueryKey, id],
      queryFn: () => ProjectAPI.getItem(id),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
    });
  },
  queryList(query: _Project.Query) {
    query = filterQuery(query);
    return queryOptions({
      queryKey: [ProjectAPI.listQueryKey, query] as any[],
      queryFn: () => ProjectAPI.getList(query),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  },
  queryMemberList(projectId: string) {
    return queryOptions({
      queryKey: [ProjectAPI.memberListQueryKey, projectId],
      queryFn: () => ProjectAPI.getMemberList(projectId),
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });
  },
};
