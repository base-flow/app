import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Pagination, Result } from "antd";
import { SquarePlus } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import FieldSorter from "@/components/FieldSorter";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import SkeletonCardList from "@/components/SkeletonCardList";
import { FlagSrc } from "@/components/utils";
import { useAppStore } from "@/modules/app/store";
import { useEvent, usePermissions } from "@/utils/hooks";
import { ProjectAPI } from "../../api";
import ProjectEdit from "../ProjectEdit";
import ProjectItem from "../ProjectItem";

interface ProjectListProps {
  query: _Project.Query;
}

const Component: FC<ProjectListProps> = (props) => {
  const { permissions, getPermissionsInProject } = usePermissions();
  const [myProjectRoles] = useAppStore(useShallow(({ myProjectRoles }) => [myProjectRoles]));
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(props.query);
  const projectQuery = useQuery(ProjectAPI.queryList(query));
  const queryClient = useQueryClient();
  const [curEdit, setCurEdit] = useState<_Project.IProject>();
  const projectList = projectQuery.data?.list;
  const projectQuerySummary = projectQuery.data?.summary;

  useMemo(() => {
    setQuery(props.query);
  }, [props.query]);

  const onSearch = useEvent((keyword?: string) => {
    setQuery({ ...query, page: undefined, keyword });
  });

  const onSort = useEvent((sorter: { sorterField?: string; sorterOrder?: "ascend" | "descend" }) => {
    setQuery({ ...query, page: undefined, ...sorter });
  });

  const onPageChange = useEvent((page: number) => {
    setQuery({ ...query, page });
  });

  const onCreate = useEvent(() => {
    setCurEdit({ logo: FlagSrc.create() } as _Project.IProject);
  });

  const projectDeleter = useMutation({
    mutationFn: ProjectAPI.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ProjectAPI.listQueryKey] });
    },
  });

  const onDelete = useEvent((id: string, name: string) => {
    BaseWidgets.confirm(`确定要删除“${name}”吗？`, (ok) => {
      if (ok) {
        projectDeleter.mutate(id);
      }
    });
  });

  // // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  // useEffect(() => {
  //   console.log("set top 0");
  //   if (scrollerRef.current) {
  //     scrollerRef.current!.scrollTop = 0;
  //   }
  // }, [query]);

  if (projectQuery.isError) {
    return (
      <section className="g-page">
        <Result status="warning" title={projectQuery.error.message || "错误"} />
      </section>
    );
  }

  if (!projectList || !projectQuerySummary) {
    return (
      <section className="g-page">
        <div className="hd"></div>
        <div className="bd">
          <SkeletonCardList />
        </div>
      </section>
    );
  }

  return (
    <section className="g-page">
      <LoadingMask show={projectQuery.isFetching || projectDeleter.isPending} />
      <div className="hd">
        <div>
          {permissions.project_create && (
            <Button color="primary" variant="text" icon={<SquarePlus size={14} />} onClick={onCreate}>
              创建应用
            </Button>
          )}
        </div>
        <div className="space">
          <SearchInput variant="filled" onChange={onSearch} value={query.keyword} />
          <div>
            <span style={{ marginRight: 2 }}>排序：</span>
            <FieldSorter value={query} onChange={onSort} />
          </div>
        </div>
      </div>
      <div className="bd" ref={scrollerRef}>
        <div className="g-grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 2k:grid-cols-6">
          {projectList.map((item) => {
            return (
              <ProjectItem
                key={item.id}
                getPermissionsInProject={getPermissionsInProject}
                projectRole={myProjectRoles[item.id]}
                item={item}
                onDelete={onDelete}
                setCurEdit={setCurEdit}
              />
            );
          })}
        </div>
        <Pagination
          className="g-pagination"
          align="center"
          hideOnSinglePage
          showSizeChanger={false}
          current={projectQuerySummary.page}
          pageSize={projectQuerySummary.pageSize}
          total={projectQuerySummary.total}
          onChange={onPageChange}
        />
      </div>
      <ProjectEdit item={curEdit} setItem={setCurEdit} />
    </section>
  );
};

export default memo(Component);
