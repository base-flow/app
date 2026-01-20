import { BaseWidgets } from "@baseflow/react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { Button, Result } from "antd";
import { SquarePlus } from "lucide-react";
import type { FC } from "react";
import { memo, useEffect, useMemo, useState } from "react";
import FieldSorter from "@/components/FieldSorter";
import LoadingMask from "@/components/LoadingMask";
import LoadMore from "@/components/LoadMore";
import SearchInput from "@/components/SearchInput";
import { FlagSrc } from "@/components/utils";
import { useEvent, useInfiniteList } from "@/utils/hooks";
import { FlowAppAPI } from "../../api";
import AppEdit from "../AppEdit";
import Item from "./Item";
import styles from "./index.module.scss";

const AppList: FC<{ query: FlowApp.IQuery }> = (props) => {
  const router = useRouter();
  const [query, setQuery] = useState(props.query);
  const apps = useInfiniteQuery<FlowApp.IQueryResult>(FlowAppAPI.queryInfiniteList(query));
  const appsPages = apps.data?.pages;
  const [scrollerRef, loaderRef] = useInfiniteList(apps.fetchNextPage);
  const queryClient = useQueryClient();
  const [curEdit, setCurEdit] = useState<FlowApp.IApp>();

  const [appList] = useMemo(() => {
    const list: FlowApp.IApp[] = [];
    let summary: App.ISummary | undefined;
    appsPages?.forEach((page) => {
      page.list.forEach((node) => {
        list.push(node);
      });
      if (!summary) {
        summary = page.summary;
      }
    });
    return [list, summary];
  }, [appsPages]);

  const onSearch = useEvent((keyword?: string) => {
    scrollerRef.current!.scrollTop = 0;
    setQuery({ ...query, keyword });
  });

  const onSort = useEvent((sorter: { sorterField?: string; sorterOrder?: "ascend" | "descend" }) => {
    scrollerRef.current!.scrollTop = 0;
    setQuery({ ...query, ...sorter });
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
      queryClient.invalidateQueries({ queryKey: [FlowAppAPI.itemQueryKey, args.id] });
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

  if (apps.isError) {
    return <Result status="warning" title={apps.error.message || "错误"} />;
  }

  return (
    <section className={`${styles.AppList} g-page`}>
      <LoadingMask show={apps.isFetching} />
      <div className="hd">
        <div>
          <Button color="primary" variant="text" icon={<SquarePlus size={14} />} onClick={onCreate}>
            创建应用
          </Button>
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
            return <Item key={item.id} data={item} onDelete={onDelete} setCurEdit={setCurEdit} onCollect={onCollect} />;
          })}
        </div>
        <div ref={loaderRef} className="g-loadMore">
          <LoadMore isFetching={apps.isFetching} hasNextPage={apps.hasNextPage} fetchNextPage={apps.fetchNextPage} />
        </div>
      </div>
      <AppEdit item={curEdit} setItem={setCurEdit} />
    </section>
  );
};

export default memo(AppList);
