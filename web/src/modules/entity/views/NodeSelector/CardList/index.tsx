import { useQuery } from "@tanstack/react-query";
import { Button, Pagination, Result, Segmented } from "antd";
import { FolderTree, List } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo, useState } from "react";
import type { SortField } from "@/components/FieldSorter";
import FieldSorter from "@/components/FieldSorter";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import SkeletonCardList from "@/components/SkeletonCardList";
import { ShowTotal, useEntityListChange, useEvent } from "@/utils/hooks";
import { openFile, showPath } from "@/utils/tools";
import { EntityAPI } from "../../../api";
import Breadcrumb from "../../Breadcrumb";
import EntityCard from "../../EntityCard";
import styles from "./index.module.scss";

const SorterOptions: SortField[] = ["updateAt", "createAt", "likes"];

type ListType = "dir" | "file";

const ListTypeOptions: { label: any; value: ListType; tooltip: string }[] = [
  { label: <FolderTree className="g-vertical" size={14} />, value: "dir", tooltip: "目录层级" },
  { label: <List className="g-vertical" size={14} />, value: "file", tooltip: "文件平铺" },
];

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
  const queryState = useState<_Entity.Query>({ kind, runtime, dir: rootDir });
  const query = queryState[0];
  const entityQuery = useQuery(EntityAPI.queryList(query));
  const listType: ListType = query.type ? "file" : "dir";
  const entityList = entityQuery.data?.list;
  const entityListQuery = entityQuery.data?.query || query;
  const entityListSummary = entityQuery.data?.summary;

  const setQuery = useEvent((newQuery: _Entity.Query) => {
    const { page } = newQuery;
    queryState[1]({ ...newQuery, page: page === 1 ? undefined : page });
  });

  const { onPageChange, onSort, onKeywordSearch, onListTypeChange } = useEntityListChange(entityListQuery, setQuery, "node");

  const onItemClick = useEvent((item: _Entity.IEntity) => {
    if (item.type === "directory") {
      setQuery({ dir: item.id });
    } else {
      openFile(item);
    }
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
          <SearchInput variant="filled" onChange={onKeywordSearch} width="200px" value={entityListQuery.keyword} placeholder="当前目录下搜索..." />
          <Segmented value={listType} options={ListTypeOptions} onChange={onListTypeChange} />
          <div>
            <span style={{ marginRight: 2 }}>排序：</span>
            <FieldSorter options={SorterOptions} value={entityListQuery} onChange={onSort} />
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
    </div>
  );
};

export default memo(Component);
