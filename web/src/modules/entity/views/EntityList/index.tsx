import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { MenuProps, TablePaginationConfig, TableProps } from "antd";
import { Button, Dropdown, Result, Skeleton, Space, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { ChevronDown, Copy, FolderPlus, FolderSymlink, Info, Trash2 } from "lucide-react";
import type { FC } from "react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import Collect from "@/components/Collect";
import FileTools, { type FileToolsAction } from "@/components/FileTools";
import IconEntity from "@/components/IconEntity";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import SharedEdit from "@/modules/shared/views/SharedEdit";
import { useEntityNavigate, useEntityTableChange, useEvent, useMyFavoriteIds, useTablePagination } from "@/utils/hooks";
import { debounce, normalizeEntityQuery, showPath } from "@/utils/tools";
import { EntityAPI } from "../../api";
import Breadcrumb from "../Breadcrumb";
import DataEdit from "../DataEdit";
import DirectoryEdit from "../DirectoryEdit";
import EntityCopy from "../EntityCopy";
import NodeEdit from "../NodeEdit";
import QueryEntity from "../QueryEntity";
import QueryScope from "../QueryScope";
import WorkflowEdit from "../WorkflowEdit";
import styles from "./index.module.scss";

interface EntityListProps {
  space: {
    id: string;
    name: string;
    type: "personal" | "project";
  };
  isMine: boolean;
  rootDir: string;
  rootName: string;
  query: _Entity.Query;
  setCurrentPath: (path: string) => void;
}

const Component: FC<EntityListProps> = (props) => {
  const { space, isMine, rootDir, rootName, setCurrentPath } = props;
  const [currentEdit, setCurrentEdit] = useState<Partial<_Entity.IEntity>>();
  const [batchEdit, setBatchEdit] = useState<{ ids: string[]; file?: string; action: "copy" }>();
  const [shared, setShared] = useState<Partial<_Shared.IShared>>();
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

  const setQuery = useEvent((newQuery: _Entity.Query) => {
    navigate({ to: ".", search: normalizeEntityQuery(newQuery, {}, props.rootDir) });
  });

  const { onTableChange, onKeywordChange, onTypeChange, onScopeChange } = useEntityTableChange(entityListQuery, setQuery);

  const { fileNavigate } = useEntityNavigate();
  const closeCurrentEdit = useEvent(() => setCurrentEdit(undefined));
  const closeBatchEdit = useEvent(() => setBatchEdit(undefined));
  const closeShared = useEvent(() => setShared(undefined));

  const entityDeleter = useMutation({
    mutationFn: EntityAPI.batchDelete,
    onSuccess: () => {
      setSelectedRows([]);
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey] });
    },
  });

  const onBatchCopySuccess = useEvent(() => {
    setSelectedRows([]);
    closeBatchEdit();
  });

  const onSharedSuccess = useEvent(() => {
    setSelectedRows([]);
    closeShared();
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

  const createShare = useEvent((ids: string[]) => {
    setShared({
      ids,
      name: `${space.name}的分享#${dayjs().format("YYYY-MM-DD~HH:mm")}`,
      expiration: "day",
      spaceType: space.type,
      spaceId: space.id,
    });
  });

  const createDirectory = useEvent(() => {
    setCurrentEdit({ type: "directory", parentId: entityListQuery.dir!, spaceType: space.type, spaceId: space.id });
  });

  const createWorkflow = useEvent(() => {
    setCurrentEdit({ type: "workflow", parentId: entityListQuery.dir!, spaceType: space.type, spaceId: space.id });
  });

  const createNode = useEvent(() => {
    setCurrentEdit({ type: "node", parentId: entityListQuery.dir!, spaceType: space.type, spaceId: space.id, kind: "executor" });
  });

  const createData = useEvent(() => {
    setCurrentEdit({ type: "data", parentId: entityListQuery.dir!, spaceType: space.type, spaceId: space.id });
  });

  const createrMenu = useMemo(() => {
    const items: MenuProps["items"] = [
      {
        label: "流程",
        key: "flow",
        icon: <IconEntity type="workflow" />,
      },
      {
        label: "节点",
        key: "node",
        icon: <IconEntity type="node" />,
      },
      {
        label: "数据",
        key: "data",
        icon: <IconEntity type="data" />,
      },
    ];
    return {
      items,
      onClick: ({ key }: { key: string }) => {
        if (key === "flow") {
          createWorkflow();
        } else if (key === "node") {
          createNode();
        } else if (key === "data") {
          createData();
        }
      },
    };
  }, [createWorkflow, createNode, createData]);

  const batchMenu = useMemo(() => {
    const items: MenuProps["items"] = [
      {
        label: "分享",
        key: "share",
        icon: <Copy size={13} />,
      },
      {
        label: "移动/复制",
        key: "copy",
        icon: <Copy size={13} />,
      },
      {
        label: "删除",
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
        } else if (key === "share") {
          createShare(selectedRows);
        }
      },
    };
  }, [selectedRows, onBatchDelete, createShare]);

  const onToolsClick = useEvent((item: _Entity.IEntity, action: FileToolsAction) => {
    if (action === "modify") {
      setCurrentEdit(item);
    } else if (action === "delete") {
      BaseWidgets.confirm(`确定要删除“${item.name}”吗？`, (ok) => {
        if (ok) {
          entityDeleter.mutate([item.id]);
        }
      });
    } else if (action === "copy") {
      setBatchEdit({ ids: [item.id], file: item.name, action: "copy" });
    } else if (action === "share") {
      createShare([item.id]);
    }
  });

  const columns = useMemo<TableProps<_Entity.IEntity>["columns"]>(() => {
    return [
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        sorter: true,
        sortOrder: (entityListQuery.sorterField === "name" && entityListQuery.sorterOrder) || null,
        className: "g-file-cell",
        render: (name, row) => (
          <>
            <div className="g-entity-cell">
              <IconEntity className="icon" type={row.type} />
              <a onClick={() => (row.type === "directory" ? setQuery({ dir: row.id }) : fileNavigate(row))}>{name}</a>
              <Info className="readme" size={12} />
              {row.path ? (
                <Tooltip placement="bottom" title={showPath(row.path)}>
                  <FolderSymlink className="dir" type="directory" size={12} onClick={() => setQuery({ dir: row.parentId })} />
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
        sorter: true,
        sortOrder: (entityListQuery.sorterField === "type" && entityListQuery.sorterOrder) || null,
        width: 140,
      },
      {
        title: "运行环境",
        dataIndex: "runtime",
        key: "runtime",
        sorter: true,
        sortOrder: (entityListQuery.sorterField === "runtime" && entityListQuery.sorterOrder) || null,
        width: 140,
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
  }, [entityListQuery, favoriteMap, onFavoriteChange, setQuery, onToolsClick, fileNavigate]);

  const pagination: TablePaginationConfig = useTablePagination(entityListSummary);

  const rowSelection: TableProps<any>["rowSelection"] = useMemo(
    () => ({
      selectedRowKeys: selectedRows,
      onChange: setSelectedRows as any,
    }),
    [selectedRows],
  );

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
      <div className={`${styles.EntityList} g-page`}>
        <div className="hd" />
        <div className="bd" ref={scrollerRef}>
          <Result status="warning" title={entityQuery.error?.message || "错误"} />
        </div>
      </div>
    );
  }

  if (!entityList || !entityListSummary) {
    return (
      <div className={`${styles.EntityList} g-page`}>
        <div className="hd" />
        <div className="bd" ref={scrollerRef}>
          <Skeleton active />
        </div>
      </div>
    );
  }

  setCurrentPath(entityListSummary.path);

  return (
    <div className={`${styles.EntityList} g-page`}>
      <LoadingMask show={entityQuery.isFetching || entityDeleter.isPending || favoriteLoading} />
      <div className="hd">
        <div className={`${styles.EntityList}__search`}>
          <Breadcrumb rootDir={rootDir} rootName={rootName} listPath={entityListSummary.path} query={entityListQuery} setQuery={setQuery} />
          <div className="space">
            <SearchInput value={entityListQuery.keyword} onChange={onKeywordChange} placeholder="当前目录下搜索..." />
            <QueryScope value={entityListQuery.scope} onChange={onScopeChange} />
          </div>
        </div>
        <div className={`${styles.EntityList}__filter`}>
          {!isMine ? (
            <div style={{ height: "32px" }} />
          ) : !selectedRows.length ? (
            <Space>
              <Dropdown menu={createrMenu}>
                <Button icon={<ChevronDown size={13} />} type="primary">
                  新建文件
                </Button>
              </Dropdown>
              <Button icon={<FolderPlus size={13} strokeWidth={2.5} />} onClick={createDirectory}>
                新建目录
              </Button>
            </Space>
          ) : (
            <Dropdown menu={batchMenu}>
              <Button loading={entityDeleter.isPending} icon={<ChevronDown size={13} />} iconPlacement="end">
                批量操作
              </Button>
            </Dropdown>
          )}
          <QueryEntity size={12} value={entityListQuery.type} onChange={onTypeChange} />
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
      {currentEdit?.type === "directory" && <DirectoryEdit item={currentEdit} onCancel={closeCurrentEdit} onSuccess={closeCurrentEdit} />}
      {currentEdit?.type === "workflow" && <WorkflowEdit item={currentEdit} onCancel={closeCurrentEdit} onSuccess={closeCurrentEdit} />}
      {currentEdit?.type === "node" && <NodeEdit item={currentEdit} onCancel={closeCurrentEdit} onSuccess={closeCurrentEdit} />}
      {currentEdit?.type === "data" && <DataEdit item={currentEdit} onCancel={closeCurrentEdit} onSuccess={closeCurrentEdit} />}
      {batchEdit?.action === "copy" && (
        <EntityCopy ids={batchEdit.ids} file={batchEdit.file} onCancel={closeBatchEdit} onSuccess={onBatchCopySuccess} />
      )}
      {shared && <SharedEdit item={shared} onCancel={closeShared} onSuccess={onSharedSuccess} />}
      {/* <FlowEdit item={curEdit} setItem={setCurEdit} /> */}
    </div>
  );
};

export default memo(Component);
