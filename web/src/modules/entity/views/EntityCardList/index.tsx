import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Pagination, Result, Segmented, Select } from "antd";
import type { FC } from "react";
import { memo, useMemo, useRef, useState } from "react";
import type { SortField } from "@/components/FieldSorter";
import FieldSorter from "@/components/FieldSorter";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import SkeletonCardList from "@/components/SkeletonCardList";
import { NodeKindOptions, StoreOptions } from "@/const";
import { ShowTotal, useEntityListChange, useEntityNavigate, useEvent, useMyFavoriteIds } from "@/utils/hooks";
import { normalizeEntityQuery } from "@/utils/tools";
import { EntityAPI } from "../../api";
import Breadcrumb from "../Breadcrumb";
import EntityCard from "../EntityCard";
import QueryScope from "../QueryScope";
import styles from "./index.module.scss";

const SorterOptions: SortField[] = ["updateAt", "createAt", "likes"];

interface EntityCardListProps {
  rootName: string;
  rootDir: string;
  query: _Entity.Query;
  entity: _App.EntityFileType;
}

const Component: FC<EntityCardListProps> = (props) => {
  const { rootName, rootDir } = props;
  const { favoriteMap, favoriteLoading, onFavoriteChange } = useMyFavoriteIds();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const queryState = useState(props.query);
  const query = queryState[0];
  const entityQuery = useQuery(EntityAPI.queryList(query));
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const entityList = entityQuery.data?.list;
  const entityListQuery = entityQuery.data?.query || query;
  const entityListSummary = entityQuery.data?.summary;
  const [curEdit, setCurEdit] = useState<Partial<_Entity.IEntity>>();

  useMemo(() => {
    queryState[1](props.query);
  }, [props.query, queryState[1]]);

  const setQuery = useEvent((newQuery: _Entity.Query) => {
    navigate({
      to: ".",
      search: normalizeEntityQuery(newQuery, {}, props.rootDir),
    });
  });

  const { onPageChange, onSorterChange, onKeywordChange, onKindChange, onScopeChange } = useEntityListChange(entityListQuery, setQuery);

  const { fileNavigate } = useEntityNavigate();
  const onItemClick = useEvent((item: _Entity.IEntity) => {
    if (item.type === "directory") {
      setQuery({ dir: item.id });
    } else {
      fileNavigate(item);
    }
  });

  const entityAlter = useMutation({
    mutationFn: EntityAPI.updateItem,
    onSuccess: (result, args) => {
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey, { dir: entityListQuery.dir }] });
    },
  });

  const entityDeleter = useMutation({
    mutationFn: EntityAPI.batchDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey, { dir: entityListQuery.dir }] });
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

  if (entityQuery.isError) {
    return (
      <section className={`${styles.EntityCardList} g-page`}>
        <div className="hd" />
        <div className="bd" ref={scrollerRef}>
          <Result status="warning" title={entityQuery.error?.message || "错误"} />
        </div>
      </section>
    );
  }

  if (!entityList || !entityListSummary) {
    return (
      <section className={`${styles.EntityCardList} g-page`}>
        <div className="hd" />
        <div className="bd" ref={scrollerRef}>
          <SkeletonCardList />
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.EntityCardList} g-page`}>
      <LoadingMask show={entityQuery.isFetching || entityAlter.isPending || entityDeleter.isPending || favoriteLoading} />
      <div className="hd">
        <div className="space">
          <Segmented options={StoreOptions} />
          <Breadcrumb rootDir={rootDir} rootName={rootName} listPath={entityListSummary.path} query={entityListQuery} setQuery={setQuery} />
        </div>
        <div className="space">
          <SearchInput variant="filled" width="250px" onChange={onKeywordChange} value={entityListQuery.keyword} placeholder="当前目录下搜索..." />
          <Select popupMatchSelectWidth={false} value={entityListQuery.kind || ""} options={NodeKindOptions} onChange={onKindChange} />
          <QueryScope value={entityListQuery.scope} onChange={onScopeChange} />
          <div>
            <span style={{ marginRight: 2 }}>排序：</span>
            <FieldSorter options={SorterOptions} value={entityListQuery} onChange={onSorterChange} />
          </div>
        </div>
      </div>
      <div className="bd" ref={scrollerRef}>
        <div className="g-grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 2k:grid-cols-6">
          {entityList.map((item) => {
            return (
              <EntityCard
                key={item.id}
                item={item}
                favoriteMap={favoriteMap}
                onDelete={onDelete}
                setCurEdit={setCurEdit}
                onFavoriteChange={onFavoriteChange}
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
          current={entityListSummary.page}
          pageSize={entityListSummary.pageSize}
          total={entityListSummary.total}
          showTotal={ShowTotal}
          onChange={onPageChange}
        />
      </div>
    </section>
  );
};

export default memo(Component);
