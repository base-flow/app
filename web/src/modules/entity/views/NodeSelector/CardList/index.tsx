import { useQuery } from "@tanstack/react-query";
import { Button, Pagination, Result } from "antd";
import type { FC } from "react";
import { memo, useMemo, useState } from "react";
import type { SortField } from "@/components/FieldSorter";
import FieldSorter from "@/components/FieldSorter";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import SkeletonCardList from "@/components/SkeletonCardList";
import { ShowTotal, useEntityListChange, useEvent } from "@/utils/hooks";
import { normalizeEntityQuery, openFile } from "@/utils/tools";
import { EntityAPI } from "../../../api";
import Breadcrumb from "../../Breadcrumb";
import EntityCard from "../../EntityCard";
import QueryScope from "../../QueryScope";
import styles from "./index.module.scss";

const SorterOptions: SortField[] = ["updateAt", "createAt", "likes"];

interface NodeSelectorProps {
  kind: _Node.Kind;
  runtime: _App.Runtime;
  rootDir: string;
  rootName: string;
  favoriteMap: {
    [id: string]: boolean;
  };
  onFavoriteChange: (id: string, collected: boolean) => void;
  //onSubmit: (item: { type: string; dsl: string }) => void;
}

const Component: FC<NodeSelectorProps> = ({ kind, runtime, rootDir, rootName, favoriteMap, onFavoriteChange }) => {
  const queryState = useState<_Entity.Query>({ type: "node", keepDirectories: true, kind, runtime, dir: rootDir });
  const query = queryState[0];
  const entityQuery = useQuery(EntityAPI.queryList(query));
  const entityList = entityQuery.data?.list;
  const entityListQuery = entityQuery.data?.query || query;
  const entityListSummary = entityQuery.data?.summary;

  const setQuery = useEvent((newQuery: _Entity.Query) => {
    queryState[1](normalizeEntityQuery(newQuery, { type: "node", keepDirectories: true, kind, runtime }));
  });

  const { onPageChange, onSorterChange, onKeywordChange, onScopeChange } = useEntityListChange(entityListQuery, setQuery);

  const dirNavigate = useEvent((dir: string) => {
    setQuery({ dir });
  });

  if (entityQuery.isError) {
    return (
      <div className={styles.NodeSelectorCardList} style={{ paddingTop: "30px" }}>
        <Result status="warning" title={entityQuery.error?.message || "错误"} />
      </div>
    );
  }

  if (!entityList || !entityListSummary) {
    return (
      <div className={styles.NodeSelectorCardList} style={{ paddingTop: "30px" }}>
        <SkeletonCardList />
      </div>
    );
  }

  return (
    <div className={styles.NodeSelectorCardList}>
      <LoadingMask show={entityQuery.isFetching} />
      <div className="hd">
        <div className="space">
          <Breadcrumb rootDir={rootDir} rootName={rootName} listPath={entityListSummary.path} query={entityListQuery} setQuery={setQuery} />
        </div>
        <div className="space">
          <SearchInput variant="filled" onChange={onKeywordChange} width="220px" value={entityListQuery.keyword} placeholder="当前目录下搜索..." />
          <QueryScope value={entityListQuery.descendants} onChange={onScopeChange} />
          <div>
            <span style={{ marginRight: 2 }}>排序：</span>
            <FieldSorter options={SorterOptions} value={entityListQuery} onChange={onSorterChange} />
          </div>
        </div>
      </div>
      <div className="bd">
        <div className="g-grid grid-cols-4">
          {entityList.map((item) => {
            return (
              <EntityCard
                selector
                key={item.id}
                item={item}
                favoriteMap={favoriteMap}
                onFavoriteChange={onFavoriteChange}
                fileNavigate={openFile}
                dirNavigate={dirNavigate}
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
    </div>
  );
};

export default memo(Component);
