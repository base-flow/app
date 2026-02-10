import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import type { MenuProps, TablePaginationConfig, TableProps } from "antd";
import { Button, Dropdown, Result, Skeleton, Table, Tooltip } from "antd";
import { ChevronDown, Copy, FolderSymlink, FolderTree, Plus, Trash2 } from "lucide-react";
import type { FC } from "react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import Collect from "@/components/Collect";
import FileTools, { type FileToolsAction } from "@/components/FileTools";
import IconEntity from "@/components/IconEntity";
import type { LinkItem } from "@/components/LinkTab";
import LinkTab from "@/components/LinkTab";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import { useEvent, useMyFavoriteIds, useTableChange, useTablePagination } from "@/utils/hooks";
import { debounce, showPath } from "@/utils/tools";
import { EntityAPI } from "../../api";
import Breadcrumb from "../Breadcrumb";
import EntityCopy from "../EntityCopy";
import EntityRename from "../EntityRename";
import styles from "./index.module.scss";

interface EntityListProps {
  rootDir: string;
  rootName: string;
  query: _Entity.Query;
  setCurrentPath: (path: string) => void;
}

const Component: FC<EntityListProps> = (props) => {
  const { rootDir, rootName, setCurrentPath } = props;
  const [currentEdit, setCurrentEdit] = useState<{ item: _Entity.IEntity; action: "rename" }>();
  const [batchEdit, setBatchEdit] = useState<{ ids: string[]; file?: string; action: "copy" }>();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [tableScroll, setTableScroll] = useState({ y: 0 });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { favoriteMap, favoriteLoading, onFavoriteChange } = useMyFavoriteIds();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const queryState = useState(props.query);
  const query = queryState[0];
  const entityQuery = useQuery(EntityAPI.queryList(query));
  const entityList = entityQuery.data?.list;
  const entityListQuery = entityQuery.data?.query || query;
  const entityListSummary = entityQuery.data?.summary;

  useMemo(() => {
    queryState[1](props.query);
  }, [props.query, queryState[1]]);

  const setQuery = useEvent((query: _Entity.Query) => {
    const { dir, page } = query;
    navigate({ to: ".", search: { ...query, dir: dir === props.rootDir ? undefined : dir, page: page === 1 ? undefined : page } });
  });

  const { onTableChange, onDirSearch } = useTableChange(query, setQuery);
  const closeCurrentEdit = useEvent(() => setCurrentEdit(undefined));
  const closeBatchEdit = useEvent(() => setBatchEdit(undefined));

  const entityAlter = useMutation({
    mutationFn: EntityAPI.updateItem,
    onSuccess: () => {
      closeCurrentEdit();
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey] });
    },
  });

  const entityDeleter = useMutation({
    mutationFn: EntityAPI.batchDelete,
    onSuccess: () => {
      setSelectedRows([]);
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey] });
    },
  });

  const entityMover = useMutation({
    mutationFn: EntityAPI.batchMove,
    onSuccess: () => {
      closeBatchEdit();
      setSelectedRows([]);
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey] });
    },
  });

  // const onCreate = useEvent(() => {
  //   setCurEdit({ directoryId });
  // });

  const onBatchDelete = useEvent((ids: string[]) => {
    BaseWidgets.confirm(`确定要删除选中的“${ids.length}”项吗？`, (ok) => {
      if (ok) {
        entityDeleter.mutate(ids);
      }
    });
  });

  const onBatchCopy = useEvent((ids: string[], target: string, action: "copy" | "move") => {
    entityMover.mutate({ ids, target, action });
  });

  const onRename = useEvent((id: string, name: string) => {
    entityAlter.mutate({ id, name });
  });

  const batchMenu = useMemo(() => {
    const items: MenuProps["items"] = [
      {
        label: "移动/复制",
        key: "copy",
        icon: <Copy size={13} />,
      },
      {
        label: "批量删除",
        key: "delete",
        icon: <Trash2 size={13} />,
      },
    ];
    return {
      items,
      onClick: ({ key }: { key: string }) => {
        if (key === "delete") {
          onBatchDelete(selectedRows);
        } else if (key === "copy") {
          setBatchEdit({ ids: selectedRows, action: "copy" });
        }
      },
    };
  }, [selectedRows, onBatchDelete]);

  const onToolsClick = useEvent((item: _Entity.IEntity, action: FileToolsAction) => {
    if (action === "rename") {
      setCurrentEdit({ item, action: "rename" });
    } else if (action === "delete") {
      BaseWidgets.confirm(`确定要删除“${item.name}”吗？`, (ok) => {
        if (ok) {
          entityDeleter.mutate([item.id]);
        }
      });
    } else if (action === "copy") {
      setBatchEdit({ ids: [item.id], file: item.name, action: "copy" });
    }
  });

  const columns = useMemo<TableProps<_Entity.IEntity>["columns"]>(() => {
    return [
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        className: "g-file-cell",
        render: (name, row) => (
          <>
            <div className="g-entity-cell">
              <IconEntity className="icon" type={row.type} />
              {row.type === "directory" ? (
                <Link to="." search={{ dir: row.id }}>
                  {name}
                </Link>
              ) : row.type === "workflow" ? (
                <Link to="/workflow/$workflowId" params={{ workflowId: row.id }} search={{ dir: 1 }}>
                  {name}
                </Link>
              ) : row.type === "node" ? (
                <Link to="/node/$nodeId" params={{ nodeId: row.id }}>
                  {name}
                </Link>
              ) : (
                <Link to="/node/$nodeId" params={{ nodeId: row.id }}>
                  {name}
                </Link>
              )}
              {row.path ? (
                <Tooltip placement="bottom" title={showPath(row.path)}>
                  <FolderSymlink className="dir anticon" type="directory" size={13} onClick={() => setQuery({ dir: row.parentId })} />
                </Tooltip>
              ) : null}
              <Collect id={row.id} value={favoriteMap[row.id]} onChange={onFavoriteChange} />
            </div>
            <FileTools item={row} onClick={onToolsClick} />
          </>
        ),
      },
      {
        title: "文件类型",
        dataIndex: "type",
        key: "type",
        width: 100,
        align: "center",
      },
      {
        title: "运行环境",
        dataIndex: "runtime",
        key: "runtime",
        width: 140,
        align: "center",
      },
      {
        title: "创建时间",
        dataIndex: "createAt",
        key: "createAt",
        sorter: true,
        sortOrder: (entityListQuery.sorterField === "createAt" && entityListQuery.sorterOrder) || null,
        width: 140,
      },
      {
        title: "更新时间",
        dataIndex: "updateAt",
        key: "updateAt",
        sorter: true,
        sortOrder: (entityListQuery.sorterField === "updateAt" && entityListQuery.sorterOrder) || null,
        width: 140,
      },
    ];
  }, [entityListQuery, favoriteMap, onFavoriteChange, setQuery, onToolsClick]);

  const pagination: TablePaginationConfig = useTablePagination(entityListSummary);

  const rowSelection: TableProps<any>["rowSelection"] = useMemo(
    () => ({
      selectedRowKeys: selectedRows,
      onChange: setSelectedRows as any,
    }),
    [selectedRows],
  );

  const listTypeLinks = useMemo(() => {
    const { dir, keyword } = query;
    const items: LinkItem[] = [
      {
        key: "all",
        to: ".",
        search: { dir, keyword, type: undefined },
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
        to: ".",
        search: { dir, keyword, type: "workflow" },
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
        to: ".",
        search: { dir, keyword, type: "node" },
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
        to: ".",
        search: { dir, keyword, type: "data" },
        className: query.type === "data" ? "on" : undefined,
        children: (
          <>
            <IconEntity size={12} type="data" />
            <span>数据</span>
          </>
        ),
      },
    ];
    return items;
  }, [query]);

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
      <div className={`${styles.EntityList} g-page min-wrap`}>
        <div className="hd" />
        <div className="bd" ref={scrollerRef}>
          <Result status="warning" title={entityQuery.error?.message || "错误"} />
        </div>
      </div>
    );
  }

  if (!entityList || !entityListSummary) {
    return (
      <div className={`${styles.EntityList} g-page min-wrap`}>
        <div className="hd" />
        <div className="bd" ref={scrollerRef}>
          <Skeleton active />
        </div>
      </div>
    );
  }

  setCurrentPath(entityListSummary.path);

  return (
    <div className={`${styles.EntityList} g-page min-wrap`}>
      <LoadingMask show={entityQuery.isFetching || entityAlter.isPending || entityDeleter.isPending || favoriteLoading} />
      <div className="hd">
        <div className="row">
          <Breadcrumb rootDir={rootDir} rootName={rootName} listPath={entityListSummary.path} query={entityListQuery} setQuery={setQuery} />
          <SearchInput value={query.keyword} onChange={onDirSearch} placeholder="当前目录下搜索..." />
        </div>
        <div className="row">
          {!selectedRows.length ? (
            <Button icon={<Plus size={14} strokeWidth={2.5} className="anticon" />} type="primary">
              新建流程
            </Button>
          ) : (
            <Dropdown menu={batchMenu}>
              <Button loading={entityDeleter.isPending} icon={<ChevronDown size={13} className="anticon" />} iconPlacement="end">
                批量操作
              </Button>
            </Dropdown>
          )}
          <LinkTab links={listTypeLinks} />
        </div>
      </div>
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
      {currentEdit?.action === "rename" && <EntityRename item={currentEdit.item} onCancel={closeCurrentEdit} onSubmit={onRename} />}
      {batchEdit?.action === "copy" && <EntityCopy ids={batchEdit.ids} file={batchEdit.file} onCancel={closeBatchEdit} onSubmit={onBatchCopy} />}
      {/* <FlowEdit item={curEdit} setItem={setCurEdit} /> */}
    </div>
  );
};

export default memo(Component);
