import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import type { MenuProps, TablePaginationConfig, TableProps } from "antd";
import { Button, Dropdown, Result, Skeleton, Space, Table, Tooltip } from "antd";
import { ChevronDown, Delete, FolderSymlink, FolderTree, Plus, Trash2 } from "lucide-react";
import type { FC } from "react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import Collect from "@/components/Collect";
import IconEntity from "@/components/IconEntity";
import type { LinkItem } from "@/components/LinkTab";
import LinkTab from "@/components/LinkTab";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import { useEvent, useFolderRoute, useMyFavoriteIds, useTableChange, useTablePagination } from "@/utils/hooks";
import { debounce } from "@/utils/tools";
import { EntityAPI } from "../../api";
import styles from "./index.module.scss";

interface EntityListProps {
  rootDir: string;
  rootName: string;
  query: _Entity.Query;
}

const Component: FC<EntityListProps> = (props) => {
  const [curEdit, setCurEdit] = useState<Partial<_Entity.IEntity>>();
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

  const breadcrumb = useFolderRoute(props.rootName, props.rootDir, entityListQuery, entityListSummary?.path, setQuery);

  const { onTableChange, onDirSearch } = useTableChange(query, setQuery);

  const entityAlter = useMutation({
    mutationFn: EntityAPI.updateItem,
    onSuccess: (result, args) => {
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey, { dir: query.dir }] });
      queryClient.invalidateQueries({ queryKey: [EntityAPI.itemQueryKey, args.id] });
    },
  });

  const entityDeleter = useMutation({
    mutationFn: EntityAPI.batchDelete,
    onSuccess: () => {
      setSelectedRows([]);
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey, { dir: query.dir }] });
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  const batchMenu = useMemo(() => {
    const items: MenuProps["items"] = [
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
        }
      },
    };
  }, [selectedRows]);

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
              <Link to="." search={{ dir: row.id }}>
                {name}
              </Link>
            ) : row.type === "workflow" ? (
              <Link to="/workflow/$workflowId" params={{ workflowId: row.id }} search={{ dir: 1 }}>
                {name}
              </Link>
            ) : (
              <Link to="/node/$nodeId" params={{ nodeId: row.id }}>
                {name}
              </Link>
            )}
            {row.path ? (
              <Tooltip
                placement="bottom"
                title={
                  row.path
                    .replace(/\/.+? /g, "/")
                    .replace(/^\/.+?\//, "/")
                    .replace(/\/[^/]+?$/, "") || "/"
                }
              >
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
      },
      {
        title: "创建者",
        dataIndex: "createBy",
        key: "createBy",
        width: 140,
      },
      {
        title: "更新者",
        dataIndex: "updateBy",
        key: "updateBy",
        width: 140,
      },
      {
        title: "更新时间",
        dataIndex: "updateAt",
        key: "updateAt",
        sorter: true,
        sortOrder: (query.sorterField === "updateAt" && query.sorterOrder) || null,
        width: 180,
      },
      {
        title: "操作",
        key: "action",
        width: 160,
        render: (_, row) => {
          return (
            <div className="g-td-actions">
              <a>编排</a>
              <a onClick={() => setCurEdit(row)}>修改</a>
              <Dropdown
                menu={{
                  onClick: ({ key }: { key: string }) => {
                    if (key === "delete") {
                      onDelete(row.id, row.name);
                    }
                  },
                  items: [
                    {
                      key: "delete",
                      label: (
                        <span>
                          <Delete /> 删除流程
                        </span>
                      ),
                    },
                  ],
                }}
              >
                <a>
                  <span>更多</span>
                  <ChevronDown size={13} className="anticon" />
                </a>
              </Dropdown>
            </div>
          );
        },
      },
    ];
  }, [query, favoriteMap]);

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
    ];
    return <LinkTab links={items} />;
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

  if (!entityList) {
    return (
      <div className={`${styles.EntityList} g-page min-wrap`}>
        <div className="hd" />
        <div className="bd" ref={scrollerRef}>
          <Skeleton active />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.EntityList} g-page min-wrap`}>
      <LoadingMask show={entityQuery.isFetching || entityAlter.isPending || entityDeleter.isPending || favoriteLoading} />
      <div className="hd">
        <div className="row">
          {breadcrumb}
          <Space>
            <SearchInput value={query.keyword} onChange={onDirSearch} placeholder="当前目录下搜索..." />
          </Space>
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
          {listTypeLinks}
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
      {/* <FlowEdit item={curEdit} setItem={setCurEdit} /> */}
    </div>
  );
};

export default memo(Component);
