import { useQuery } from "@tanstack/react-query";
import type { TablePaginationConfig, TableProps } from "antd";
import { Button, Result, Skeleton, Table, Tooltip } from "antd";
import classnames from "classnames";
import { ArrowLeft, FolderSymlink, FolderTree, Star } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo, useState } from "react";
import Collect from "@/components/Collect";
import IconEntity from "@/components/IconEntity";
import type { LinkItem } from "@/components/LinkTab";
import LinkTab from "@/components/LinkTab";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import { useEvent, useMyFavoriteList, useTableChange, useTablePagination } from "@/utils/hooks";
import { openFile, showPath } from "@/utils/tools";
import { EntityAPI } from "../../api";
import Breadcrumb from "../Breadcrumb";
import styles from "./index.module.scss";

interface EntitySelectorProps {
  spaceDir: string;
  spaceName: string;
  query: _Entity.Query;
  maximum?: number;
  disabledItems?: { [id: string]: boolean };
  onCancel: () => void;
  onSubmit: (selectedIds: string[]) => void;
}

const Component: FC<EntitySelectorProps> = (props) => {
  const { onCancel, onSubmit, spaceDir, spaceName, maximum, disabledItems = {} } = props;
  const { favoriteQuery, onFavoriteChange } = useMyFavoriteList();
  const favoriteList = useMemo(() => {
    return favoriteQuery.data?.filter((item) => item.spaceDir === spaceDir);
  }, [favoriteQuery.data, spaceDir]);
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
  const [showFavs, setShowFavs] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>();
  const selectedNum = selectedRows?.length || 0;
  const queryState = useState(props.query);
  const query = queryState[0];
  const entityQuery = useQuery(EntityAPI.queryList(query));
  const entityList = entityQuery.data?.list;
  const entityListQuery = entityQuery.data?.query || query;
  const entityListSummary = entityQuery.data?.summary;

  const setQuery = useEvent((query: _Entity.Query) => {
    setSelectedRows(undefined);
    setShowFavs(false);
    const { page } = query;
    queryState[1]({ ...query, page: page === 1 ? undefined : page });
  });

  const { onTableChange, onDirSearch } = useTableChange(query, setQuery);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  const columns = useMemo<TableProps<_Entity.IEntity>["columns"]>(() => {
    return [
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        render: (name, row) => (
          <div className="g-entity-cell">
            <IconEntity className="icon" type={row.type} />
            {row.type === "directory" ? (
              <a onClick={() => setQuery({ dir: row.id })}>{name}</a>
            ) : (
              <a onClick={() => openFile(row, "EntityView")}>{name}</a>
            )}
            {row.path ? (
              <Tooltip placement="bottom" title={showPath(row.path)}>
                <FolderSymlink className="dir anticon" type="directory" size={13} onClick={() => setQuery({ dir: row.parentId })} />
              </Tooltip>
            ) : null}
            <Collect id={row.id} value={favoriteMap[row.id]} onChange={onFavoriteChange} />
          </div>
        ),
      },
      {
        title: "运行环境",
        dataIndex: "runtime",
        key: "runtime",
        width: 140,
        align: "center",
        sorter: !showFavs,
        sortOrder: (query.sorterField === "runtime" && query.sorterOrder) || null,
      },
      {
        title: "创建时间",
        dataIndex: "createAt",
        key: "createAt",
        width: 140,
        sorter: !showFavs,
        sortOrder: (query.sorterField === "createAt" && query.sorterOrder) || null,
      },
      {
        title: "更新时间",
        dataIndex: "updateAt",
        key: "updateAt",
        width: 140,
        sorter: !showFavs,
        sortOrder: (query.sorterField === "updateAt" && query.sorterOrder) || null,
      },
    ];
  }, [query, favoriteMap, showFavs]);

  const pagination: TablePaginationConfig = useTablePagination(entityListSummary);

  const rowSelection: TableProps<any>["rowSelection"] = useMemo(
    () => ({
      selectedRowKeys: selectedRows,
      onChange: setSelectedRows as any,
      getCheckboxProps: (record: _Entity.IEntity) => ({
        disabled: disabledItems[record.id],
      }),
    }),
    [selectedRows, disabledItems],
  );

  const onListTypeTo = useEvent((item: LinkItem) =>
    setQuery({ dir: query.dir, keyword: query.keyword, type: item.key === "all" ? undefined : (item.key as _App.EntityFileType) }),
  );

  const listTypeLinks = useMemo(() => {
    const items: LinkItem[] = [
      {
        key: "all",
        className: !query.type ? "on" : undefined,
        children: (
          <>
            <FolderTree size={12} />
            <span>目录</span>
          </>
        ),
      },
      {
        key: "workflow",
        className: query.type === "workflow" ? "on" : undefined,
        children: (
          <>
            <IconEntity size={12} type="workflow" />
            <span>流程</span>
          </>
        ),
      },
      {
        key: "node",
        className: query.type === "node" ? "on" : undefined,
        children: (
          <>
            <IconEntity size={12} type="node" />
            <span>节点</span>
          </>
        ),
      },
      {
        key: "data",
        className: query.type === "data" ? "on" : undefined,
        children: (
          <>
            <IconEntity size={12} type="data" />
            <span>数据</span>
          </>
        ),
      },
    ];
    return <LinkTab links={items} onTo={onListTypeTo} />;
  }, [query, onListTypeTo]);

  const tableScroll = useMemo(() => {
    return showFavs ? { y: 500 } : { y: 460 };
  }, [showFavs]);

  if (entityQuery.isError) {
    return (
      <div className={styles.EntitySelector}>
        <Result status="warning" title={entityQuery.error?.message || "错误"} />
      </div>
    );
  }

  if (!entityList || !entityListSummary) {
    return (
      <div className={styles.EntitySelector}>
        <Skeleton active />
      </div>
    );
  }

  return (
    <div className={styles.EntitySelector}>
      <LoadingMask show={entityQuery.isFetching || favoriteQuery.isFetching} />
      {showFavs ? (
        <div className={classnames("hd", `${styles.EntitySelector}__favs`)}>
          <div className="comp-Pathcrumb">
            <span
              className="back"
              title="后退"
              onClick={() => {
                setSelectedRows(undefined);
                setShowFavs(false);
              }}
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
            </span>
            <span className="current root">我的收藏</span>
            <span className="filter">({spaceName})</span>
          </div>
        </div>
      ) : (
        <div className="hd">
          <div className="row">
            <Breadcrumb rootDir={spaceDir} rootName={spaceName} listPath={entityListSummary.path} query={entityListQuery} setQuery={setQuery} />
            <SearchInput value={query.keyword} onChange={onDirSearch} placeholder="当前目录下搜索..." />
          </div>
          <div className="row">
            <div
              className="use-favs"
              onClick={() => {
                setSelectedRows(undefined);
                setShowFavs(true);
              }}
            >
              <Star size={12} className="anticon" style={{ marginRight: "3px" }} />
              我的收藏
            </div>
            {listTypeLinks}
          </div>
        </div>
      )}
      <div className="bd">
        <Table<any>
          rowKey="id"
          size="middle"
          className="g-table"
          columns={columns}
          dataSource={showFavs ? favoriteList : entityList}
          pagination={showFavs ? false : pagination}
          rowSelection={rowSelection}
          scroll={tableScroll}
          onChange={onTableChange}
        />
      </div>
      <div className="ft">
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" disabled={!selectedRows?.length} onClick={() => onSubmit(selectedRows!)}>
          确定
        </Button>
        <div className={classnames("selected", { err: maximum && selectedNum > maximum })}>
          {maximum ? `最多可选${maximum}项，` : ""}
          {`已选${selectedNum}项`}
        </div>
      </div>
    </div>
  );
};

export default memo(Component);
