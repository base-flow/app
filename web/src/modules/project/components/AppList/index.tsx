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
import { FlowAppAPI } from "../../api";
import AppEdit from "../AppEdit";
import ListItem from "../ListItem";

interface AppListProps {
  query: FlowApp.IQuery;
}

const AppList: FC<AppListProps> = (props) => {
  const { permissions, getPermissionsInApp } = usePermissions();
  const [appsRole] = useAppStore(useShallow(({ resourceRoles }) => [resourceRoles.app]));
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(props.query);
  const apps = useQuery(FlowAppAPI.queryList(query));
  const queryClient = useQueryClient();
  const [curEdit, setCurEdit] = useState<FlowApp.IApp>();
  const appList = apps.data?.list;
  const appListSummary = apps.data?.summary;

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
    setCurEdit({ logo: FlagSrc.create() } as FlowApp.IApp);
  });

  const appDeleter = useMutation({
    mutationFn: FlowAppAPI.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FlowAppAPI.listQueryKey] });
    },
  });

  const appAlter = useMutation({
    mutationFn: FlowAppAPI.editItem,
    onSuccess: (result, args) => {
      queryClient.invalidateQueries({ queryKey: [FlowAppAPI.listQueryKey] });
      queryClient.setQueryData<FlowApp.IApp>([FlowAppAPI.itemQueryKey, args.id], (old) => {
        return old ? { ...old, ...args } : old;
      });
    },
  });

  const onCollect = useEvent((id: string, collected: boolean) => {
    appAlter.mutate({ id, collected });
  });

  const onDelete = useEvent((id: string, name: string) => {
    BaseWidgets.confirm(`确定要删除“${name}”吗？`, (ok) => {
      if (ok) {
        appDeleter.mutate(id);
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

  if (apps.isError) {
    return (
      <section className="g-page">
        <Result status="warning" title={apps.error.message || "错误"} />
      </section>
    );
  }

  if (!apps.isEnabled) {
    return (
      <section className="g-page">
        <Result status="403" title="您没有权限访问..." />
      </section>
    );
  }

  if (!appList || !appListSummary) {
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
      <LoadingMask show={apps.isFetching || appAlter.isPending || appDeleter.isPending} />
      <div className="hd">
        <div>
          {permissions.app_create && (
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
          {appList.map((item) => {
            return (
              <ListItem
                key={item.id}
                getPermissionsInApp={getPermissionsInApp}
                appRole={appsRole[item.id]}
                item={item}
                onDelete={onDelete}
                setCurEdit={setCurEdit}
                onCollect={onCollect}
              />
            );
          })}
        </div>
        <Pagination
          className="g-pagination"
          align="center"
          hideOnSinglePage
          showSizeChanger={false}
          current={appListSummary.page}
          pageSize={appListSummary.pageSize}
          total={appListSummary.total}
          onChange={onPageChange}
        />
      </div>
      <AppEdit item={curEdit} setItem={setCurEdit} />
    </section>
  );
};

export default memo(AppList);
