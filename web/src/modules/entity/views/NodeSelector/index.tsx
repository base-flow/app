import { useQuery } from "@tanstack/react-query";
import { Button, Pagination, Result, Segmented } from "antd";
import { ClipboardPlus, FolderTree, List } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo, useState } from "react";
import type { SortField } from "@/components/FieldSorter";
import FieldSorter from "@/components/FieldSorter";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import SkeletonCardList from "@/components/SkeletonCardList";
import { ShowTotal, useEvent, useMyFavoriteList } from "@/utils/hooks";
import { openFile, showPath } from "@/utils/tools";
import { EntityAPI } from "../../api";
import Breadcrumb from "../Breadcrumb";
import EntityCard from "../EntityCard";
import CateTab from "./CateTab";
import styles from "./index.module.scss";

const SorterOptions: SortField[] = ["updateAt", "createAt", "likes"];

type ListType = "dir" | "file";

const ListTypeOptions: { label: any; value: ListType; tooltip: string }[] = [
  { label: <FolderTree className="g-vertical" size={14} />, value: "dir", tooltip: "目录层级" },
  { label: <List className="g-vertical" size={14} />, value: "file", tooltip: "文件平铺" },
];

interface NodeSelectorProps {
  rootName: string;
  rootDir: string;
  query: _Entity.Query;
  //onSubmit: (item: { type: string; dsl: string }) => void;
}

const Component: FC<NodeSelectorProps> = (props) => {
  const { rootName, rootDir } = props;
  const { favoriteQuery, onFavoriteChange } = useMyFavoriteList();
  const favoriteList = useMemo(() => {
    return favoriteQuery.data?.filter((item) => item.type === "node");
  }, [favoriteQuery.data]);
  const favoriteMap = useMemo(() => {
    if (favoriteList) {
      return favoriteList.reduce(
        (obj, item) => {
          obj[item.id] = true;
          return obj;
        },
        {} as { [id: string]: boolean },
      );
    } else {
      return {};
    }
  }, [favoriteList]);
  const queryState = useState(props.query);
  const query = queryState[0];
  const entityQuery = useQuery(EntityAPI.queryList(query));
  const dir = query.dir || "";
  const listType: ListType = query.type ? "file" : "dir";
  const entityList = entityQuery.data?.list;
  const entityListQuery = entityQuery.data?.query || query;
  const entityListSummary = entityQuery.data?.summary;

  const setQuery = useEvent((query: _Entity.Query) => {
    const { page } = query;
    queryState[1]({ ...query, page: page === 1 ? undefined : page });
  });

  const onListTypeChange = useEvent((listType: ListType) => {
    const { dir, keyword } = query;
    if (listType === "file") {
      setQuery({ dir, keyword, type: "node" });
    } else {
      setQuery({ dir, keyword, type: undefined });
    }
  });

  const onSort = useEvent((sorter: { sorterField?: string; sorterOrder?: "ascend" | "descend" }) => {
    setQuery({ ...query, page: undefined, ...sorter });
  });

  const onPageChange = useEvent((page: number) => {
    setQuery({ ...query, page });
  });

  const onSearch = useEvent((keyword?: string) => {
    setQuery({ dir, keyword, type: query.type });
  });

  const onItemClick = useEvent((item: _Entity.IEntity) => {
    if (item.type === "directory") {
      setQuery({ dir: item.id });
    } else {
      openFile(item);
    }
  });

  if (entityQuery.isError) {
    return (
      <div className={styles.NodeSelector} style={{ paddingTop: "40px" }}>
        <Result status="warning" title={entityQuery.error?.message || "错误"} />
      </div>
    );
  }

  if (!entityList || !entityListSummary) {
    return (
      <div className={styles.NodeSelector} style={{ paddingTop: "40px" }}>
        <SkeletonCardList />
      </div>
    );
  }

  return (
    <div className={styles.NodeSelector}>
      <LoadingMask show={entityQuery.isFetching || favoriteQuery.isFetching} />
      <CateTab value="executor" />
      <div className="clipboard">
        <ClipboardPlus size="13" className="g-vertical" />
        <span>从剪贴板粘贴</span>
      </div>
      <div className="hd">
        <div className="space">
          <Breadcrumb rootDir={rootDir} rootName={rootName} listPath={entityListSummary.path} query={entityListQuery} setQuery={setQuery} />
        </div>
        <div className="space">
          <SearchInput variant="filled" onChange={onSearch} value={query.keyword} placeholder="当前目录下搜索..." />
          <Segmented value={listType} options={ListTypeOptions} onChange={onListTypeChange} />
          <div>
            <span style={{ marginRight: 2 }}>排序：</span>
            <FieldSorter options={SorterOptions} value={query} onChange={onSort} />
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
