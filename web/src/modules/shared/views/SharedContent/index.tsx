import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { TablePaginationConfig, TableProps } from "antd";
import { Button, Modal, Result, Skeleton, Space, Table, Tooltip } from "antd";
import { FolderSymlink, Link, ListX, Plus, UserRound } from "lucide-react";
import type { FC } from "react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import Collect from "@/components/Collect";
import IconEntity from "@/components/IconEntity";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import Breadcrumb from "@/modules/entity/views/Breadcrumb";
import EntitySelector from "@/modules/entity/views/EntitySelector";
import QueryEntity from "@/modules/entity/views/QueryEntity";
import QueryScope from "@/modules/entity/views/QueryScope";
import { useEntityNavigate, useEntityTableChange, useEvent, useMyFavoriteIds, useTablePagination } from "@/utils/hooks";
import { debounce, normalizeEntityQuery, showPath } from "@/utils/tools";
import { SharedAPI } from "../../api";
import styles from "./index.module.scss";

interface SharedContentProps {
  isMine: boolean;
  sharedContentMax: number;
  query: _Entity.Query;
  shared: _Shared.IShared;
}

const Component: FC<SharedContentProps> = (props) => {
  const { shared, isMine, sharedContentMax } = props;
  const [showEntitySelector, setShowEntitySelector] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [tableScroll, setTableScroll] = useState({ y: 0 });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { favoriteMap, favoriteLoading, onFavoriteChange } = useMyFavoriteIds();
  const queryState = useState(props.query);
  const query = queryState[0];
  const entityQuery = useQuery(SharedAPI.queryContentList(shared.id, query));
  const entityList = entityQuery.data?.list;
  const entityListQuery = entityQuery.data?.query || query;
  const entityListSummary = entityQuery.data?.summary;
  const entityListTotal = entityListSummary?.total || 0;

  useMemo(() => {
    queryState[1](props.query);
  }, [props.query, queryState[1]]);

  const setQuery = useEvent((newQuery: _Entity.Query) => {
    navigate({ to: ".", search: normalizeEntityQuery(newQuery, {}, shared.id) });
  });

  const { onTableChange, onKeywordChange, onTypeChange, onScopeChange } = useEntityTableChange(entityListQuery, setQuery);

  const { fileNavigate, directoryNavigate } = useEntityNavigate();

  const entityCreater = useMutation({
    mutationFn: SharedAPI.batchPutContentItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SharedAPI.contentListQueryKey, shared.id] });
    },
  });

  const entityDeleter = useMutation({
    mutationFn: SharedAPI.batchDeleteContentItem,
    onSuccess: () => {
      setSelectedRows([]);
      queryClient.invalidateQueries({ queryKey: [SharedAPI.contentListQueryKey, shared.id] });
    },
  });

  const onRemove = useEvent((ids: string[]) => entityDeleter.mutate({ sharedId: shared.id, entityIds: ids }));

  const closeEntitySelector = useEvent(() => setShowEntitySelector(false));

  const submitEntitySelector = useEvent((selectedIds: string[]) => {
    const n = sharedContentMax - entityListTotal;
    if (selectedIds.length > n) {
      BaseWidgets.message.error(
        `单次分享最多${sharedContentMax}项，还可以添加${n}项，如果要分享的文件过多，您可以将它们创建一个目录，然后将其添加！`,
        true,
      );
    } else {
      setShowEntitySelector(false);
      entityCreater.mutate({ sharedId: shared.id, entityIds: selectedIds });
    }
  });

  const columns = useMemo<TableProps<_Entity.IEntity>["columns"]>(() => {
    return [
      {
        title: "文件名称",
        dataIndex: "name",
        key: "name",
        render: (name, row) => (
          <div className="g-entity-cell">
            <IconEntity className="icon" type={row.type} />
            <a onClick={() => (row.type === "directory" ? setQuery({ dir: row.id }) : fileNavigate(row))}>{name}</a>
            {row.path ? (
              <Tooltip placement="bottom" title={showPath(row.path)}>
                {entityListQuery.dir ? (
                  <FolderSymlink className="dir" size={13} onClick={() => setQuery({ dir: row.parentId })} />
                ) : (
                  <Link className="dir" size={13} onClick={() => directoryNavigate(row, true)} />
                )}
              </Tooltip>
            ) : null}
            <Collect id={row.id} value={favoriteMap[row.id]} onChange={onFavoriteChange} />
          </div>
        ),
      },
      {
        title: "文件类型",
        dataIndex: "type",
        key: "type",
        sorter: true,
        sortOrder: (entityListQuery.sorterField === "type" && entityListQuery.sorterOrder) || null,
        width: 140,
      },
      {
        title: "运行环境",
        dataIndex: "runtime",
        key: "runtime",
        width: 140,
        sorter: true,
        sortOrder: (entityListQuery.sorterField === "runtime" && entityListQuery.sorterOrder) || null,
      },
      {
        title: "创建时间",
        dataIndex: "createAt",
        key: "createAt",
        width: 140,
        sorter: true,
        sortOrder: (entityListQuery.sorterField === "createAt" && entityListQuery.sorterOrder) || null,
      },
      {
        title: "更新时间",
        dataIndex: "updateAt",
        key: "updateAt",
        width: 140,
        sorter: true,
        sortOrder: (entityListQuery.sorterField === "updateAt" && entityListQuery.sorterOrder) || null,
      },
      {
        title: "操作",
        key: "action",
        width: 120,
        render: (_, row) => {
          return (
            isMine && (
              <div className="g-actions-cell">
                {!entityListQuery.dir && <a onClick={() => onRemove([row.id])}>移除</a>}
                <a onClick={() => onRemove([row.id])}>转存</a>
                <a onClick={() => onRemove([row.id])}>下载</a>
              </div>
            )
          );
        },
      },
    ];
  }, [entityListQuery, favoriteMap, onFavoriteChange, setQuery, fileNavigate, directoryNavigate, isMine, onRemove]);

  const pagination: TablePaginationConfig = useTablePagination(entityListSummary);

  const rowSelection: TableProps<any>["rowSelection"] = useMemo(
    () => ({
      selectedRowKeys: selectedRows,
      onChange: setSelectedRows as any,
    }),
    [selectedRows],
  );

  const addedIds = useMemo(() => {
    return (entityList || []).reduce(
      (obj, cur) => {
        obj[cur.id] = true;
        return obj;
      },
      {} as { [id: string]: boolean },
    );
  }, [entityList]);

  useEffect(() => {
    setTableScroll({ y: (scrollerRef.current?.offsetHeight || 0) - 130 });
    const onResize = debounce(() => {
      setTableScroll({ y: (scrollerRef.current?.offsetHeight || 0) - 130 });
    }, 300);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (entityQuery.isError) {
    return (
      <div className={`${styles.SharedContent} g-page`}>
        <div className="hd" />
        <div className="bd" ref={scrollerRef}>
          <Result status="warning" title={entityQuery.error?.message || "错误"} />
        </div>
      </div>
    );
  }

  if (!entityList || !entityListSummary) {
    return (
      <div className={`${styles.SharedContent} g-page`}>
        <div className="hd" />
        <div className="bd" ref={scrollerRef}>
          <Skeleton active />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.SharedContent} g-page`}>
      <LoadingMask show={entityQuery.isFetching || entityDeleter.isPending || entityCreater.isPending || favoriteLoading} />
      {entityListQuery.dir ? (
        <div className="hd">
          <Breadcrumb rootDir={shared.id} rootName={shared.name} listPath={entityListSummary.path} query={entityListQuery} setQuery={setQuery} />
          <div className="search">
            <SearchInput value={entityListQuery.keyword} placeholder="当前目录下搜索..." onChange={onKeywordChange} />
            <QueryScope value={entityListQuery.descendants} onChange={onScopeChange} />
            <QueryEntity size={12} value={entityListQuery.type} onChange={onTypeChange} />
          </div>
        </div>
      ) : (
        <div className="hd">
          <Space>
            <div className="title">
              {shared.name}
              {isMine ? (
                <div className="user">
                  (
                  <a className="link" onClick={() => navigate({ to: `/${shared.spaceType}/${shared.spaceId}/shared` })}>
                    {shared.spaceType === "personal" ? "我的分享" : "项目分享"}
                  </a>
                  )
                </div>
              ) : (
                <div className="user">
                  <span>
                    <UserRound size={12} className="g-vertical" strokeWidth={2.5} style={{ marginRight: "1px" }} />
                    {shared.createBy}
                  </span>
                </div>
              )}
            </div>
            {selectedRows.length ? (
              <Button
                size="small"
                color="danger"
                variant="filled"
                icon={<ListX size={13} strokeWidth={2.5} />}
                onClick={() => onRemove(selectedRows)}
              >
                批量移除
              </Button>
            ) : null}
          </Space>
          <div>
            {isMine && (
              <Button
                size="small"
                type="link"
                disabled={entityListTotal >= sharedContentMax}
                onClick={() => setShowEntitySelector(true)}
                icon={<Plus size={14} strokeWidth={2.5} />}
              >
                添加文件
              </Button>
            )}
          </div>
        </div>
      )}
      <div className="bd" ref={scrollerRef}>
        <Table<any>
          rowKey="id"
          size="middle"
          className="g-table"
          columns={columns}
          dataSource={entityList}
          pagination={pagination}
          rowSelection={rowSelection}
          scroll={tableScroll}
          onChange={onTableChange}
        />
      </div>
      {showEntitySelector && (
        <Modal open width={1250} onCancel={closeEntitySelector} footer={null} closable={false}>
          <EntitySelector
            query={{ dir: shared.spaceDir }}
            spaceName={shared.spaceType === "personal" ? "我的文档" : shared.spaceName}
            spaceDir={shared.spaceDir}
            onCancel={closeEntitySelector}
            onSubmit={submitEntitySelector}
            maximum={sharedContentMax - entityListTotal}
            disabledItems={addedIds}
          />
        </Modal>
      )}
    </div>
  );
};

export default memo(Component);
