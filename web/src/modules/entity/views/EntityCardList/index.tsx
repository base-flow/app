import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import type { TablePaginationConfig, TableProps } from "antd";
import { Button, Dropdown, type MenuProps, Pagination, Result, Segmented, Skeleton, Space, Table } from "antd";
import classnames from "classnames";
import { ChevronDown, Delete, Folder, FolderClosed, Plus, TextAlignJustify, Trash2 } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import FieldSorter, { type SortField } from "@/components/FieldSorter";
import IconEntity from "@/components/IconEntity";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import SkeletonCardList from "@/components/SkeletonCardList";
import { useEvent, useFolderRoute, usePermissions } from "@/utils/hooks";
import { debounce } from "@/utils/tools";
import { EntityAPI } from "../../api";
import EntityCard from "../EntityCard";
import styles from "./index.module.scss";

const StoreOptions: { label: string; value: string }[] = [
  { label: "开放平台", value: "remote" },
  { label: "当前系统", value: "local" },
];

const SorterOptions: SortField[] = ["collect", "createDate", "likes"];

interface EntityCardListProps {
  query: _Entity.Query;
  title: string;
}

const Component: FC<EntityCardListProps> = (props) => {
  const { permissions, auth } = usePermissions();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const queryState = useState(props.query);
  const query = queryState[0];
  const entityQuery = useQuery(EntityAPI.queryList(query));
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dir = query.dir || "";
  const entityList = entityQuery.data?.list;
  const entityQuerySummary = entityQuery.data?.summary;
  const [curEdit, setCurEdit] = useState<Partial<_Entity.IEntity>>();

  useMemo(() => {
    queryState[1](props.query);
  }, [props.query, queryState[1]]);

  const setQuery = useEvent((query: _Entity.Query) => {
    navigate({ to: ".", search: query });
  });

  const onStoreChange = useEvent((store?: "remote" | "local") => {
    //_setQuery({ to: ".", search: { store } });
  });

  const onSort = useEvent((sorter: { sorterField?: string; sorterOrder?: "ascend" | "descend" }) => {
    setQuery({ ...query, page: undefined, ...sorter });
  });

  const onPageChange = useEvent((page: number) => {
    setQuery({ ...query, page });
  });

  const resetQuery = useEvent(() => {
    return { ...query, keyword: undefined, page: undefined, sorterField: undefined, sorterOrder: undefined };
  });

  const onSearch = useEvent((keyword?: string) => {
    setQuery({ dir: query.dir, keyword });
  });

  const onItemClick = useEvent((item: _Entity.IEntity) => {
    if (item.type === "directory") {
      setQuery({ dir: item.id });
    }
  });

  const breadcrumb = useFolderRoute("", query, setQuery, resetQuery, entityQuerySummary);

  const entityAlter = useMutation({
    mutationFn: EntityAPI.updateItem,
    onSuccess: (result, args) => {
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey, { dir }] });
      queryClient.invalidateQueries({ queryKey: [EntityAPI.itemQueryKey, args.id] });
    },
  });

  const entityDeleter = useMutation({
    mutationFn: EntityAPI.batchDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey, { dir }] });
    },
  });

  // const onCreate = useEvent(() => {
  //   setCurEdit({ directoryId });
  // });

  const onDelete = useEvent((id: string, name: string) => {
    BaseWidgets.confirm(`确定要删除“${name}”吗？`, (ok) => {
      if (ok) {
        entityDeleter.mutate([id]);
      }
    });
  });

  const onBatchDelete = useEvent((ids: string[]) => {
    BaseWidgets.confirm(`确定要删除选中的“${ids.length}”项吗？`, (ok) => {
      if (ok) {
        entityDeleter.mutate(ids);
      }
    });
  });

  // const onToTemplate = useCallback(
  //   (id: string, name: string, templated: boolean) => {
  //     BaseWidgets.confirm(
  //       `《${name}》${templated ? "共享为模版后，该流程内所有节点及连接配置将公开可见，请注意去除敏感信息和配置账号！" : "取消共享为模版后，将不在出现在模版列表中，但不影响已基于此模版创建的流程！"}`,
  //       (ok) => {
  //         if (ok) {
  //           workflowAlter.mutate({ id });
  //         }
  //       },
  //       templated
  //         ? { title: "确定要共享为模版吗？", okText: "确定共享", cancelText: "放弃操作" }
  //         : { title: "确定要取消共享为模版吗？", okText: "确定取消", cancelText: "放弃操作" },
  //     );
  //   },
  //   [workflowAlter],
  // );

  const onCollect = useEvent((id: string, collected: boolean) => {
    //nodeAlter.mutate({ id, collected });
  });

  const header = (
    <div className="hd">
      <div className="space">
        <Segmented options={StoreOptions} onChange={onStoreChange as any} />
        {breadcrumb}
      </div>
      <div className="space">
        <SearchInput variant="filled" onChange={onSearch} value={query.keyword} placeholder="当前目录下搜索..." />
        <div>
          <span style={{ marginRight: 2 }}>排序：</span>
          <FieldSorter options={SorterOptions} value={query} onChange={onSort} />
        </div>
      </div>
    </div>
  );

  if (entityQuery.isError) {
    return (
      <section className={`${styles.EntityCardList} g-page`}>
        {header}
        <div className="bd" ref={scrollerRef}>
          <Result status="warning" title={entityQuery.error?.message || "错误"} />
        </div>
      </section>
    );
  }

  if (!entityList || !entityQuerySummary) {
    return (
      <section className={`${styles.EntityCardList} g-page`}>
        {header}
        <div className="bd" ref={scrollerRef}>
          <SkeletonCardList />
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.EntityCardList} g-page`}>
      <LoadingMask show={entityQuery.isFetching || entityAlter.isPending || entityDeleter.isPending} />
      {header}
      <div className="bd" ref={scrollerRef}>
        <div className="g-grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 2k:grid-cols-6">
          {entityList.map((item) => {
            return (
              <EntityCard
                key={item.id}
                item={item}
                permissions={permissions}
                authId={auth.id}
                onDelete={onDelete}
                setCurEdit={setCurEdit}
                onCollect={onCollect}
                onItemClick={onItemClick}
              />
            );
          })}
        </div>
        <Pagination
          className="g-pagination"
          align="center"
          hideOnSinglePage
          showSizeChanger={false}
          current={entityQuerySummary.page}
          pageSize={entityQuerySummary.pageSize}
          total={entityQuerySummary.total}
          onChange={onPageChange}
        />
      </div>
    </section>
  );
};

export default memo(Component);
