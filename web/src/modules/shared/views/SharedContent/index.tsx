import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import type { TablePaginationConfig, TableProps } from "antd";
import { Button, Dropdown, Modal, Result, Skeleton, Space, Table, Tooltip } from "antd";
import { FolderSymlink, FolderTree, Plus, StarOff } from "lucide-react";
import type { FC } from "react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import IconEntity from "@/components/IconEntity";
import type { LinkItem } from "@/components/LinkTab";
import LinkTab from "@/components/LinkTab";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import { useAppStore } from "@/modules/app/store";
import EntitySelector from "@/modules/entity/views/EntitySelector";
import { useEvent, useFolderRoute, useTablePagination } from "@/utils/hooks";
import { debounce, openEntity, sortList } from "@/utils/tools";
import { SharedAPI } from "../../api";
import styles from "./index.module.scss";

interface SharedContentProps {
  query: _Entity.Query;
  shared: _Shared.IShared;
}

const Component: FC<SharedContentProps> = (props) => {
  const shared = props.shared;
  const [showEntitySelector, setShowEntitySelector] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [tableScroll, setTableScroll] = useState({ y: 0 });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [config] = useAppStore(useShallow(({ config }) => [config]));
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const queryState = useState(props.query);
  const query = queryState[0];
  const entityQuery = useQuery(SharedAPI.queryContentList(shared.id, query));
  const dir = query.dir || "";
  const entityList = entityQuery.data?.list;
  const entityListQuery = entityQuery.data?.query || query;
  const entityListSummary = entityQuery.data?.summary;
  const entityListTotal = entityListSummary?.total || 0;
  const sharedContentMax = config!.sharedContentMax;

  useMemo(() => {
    queryState[1](props.query);
  }, [props.query, queryState[1]]);

  const setQuery = useEvent((query: _Entity.Query) => {
    navigate({ to: ".", search: { ...query, dir: query.dir || undefined } });
  });

  const breadcrumb = useFolderRoute(shared.name, "", entityListQuery, entityListSummary?.path, setQuery);

  const onSort = useEvent((sorter: { sorterField?: string; sorterOrder?: "ascend" | "descend" }) => {
    setQuery({ ...query, page: undefined, ...sorter });
  });

  const onPageChange = useEvent((page: number) => {
    setQuery({ ...query, page });
  });

  const onTableChange = useEvent((pagination: { current?: number; pageSize?: number }, filters: any, sorter: any) => {
    if (pagination.current) {
      setQuery({ ...query, page: pagination.current });
    }
  });

  const onSearch = useEvent((keyword?: string) => {
    setQuery({ dir, keyword, type: query.type });
  });

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
      );
    } else {
      setShowEntitySelector(false);
      entityCreater.mutate({ sharedId: shared.id, entityIds: selectedIds });
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  const columns = useMemo<TableProps<_Entity.IEntity>["columns"]>(() => {
    return [
      {
        title: "文件名称",
        dataIndex: "name",
        key: "name",
        render: (name, row) => (
          <div className="g-entity-cell">
            <IconEntity className="icon" type={row.type} />
            <a onClick={() => openEntity(row, false, "EntityView")}>{name}</a>
            {row.path ? (
              <Tooltip placement="bottom" title={row.path.replace(/\/.+? /g, "/").replace(/\/[^/]+?$/, "") || "/"}>
                <FolderSymlink className="dir anticon" type="directory" size={13} onClick={() => openEntity(row, true, "EntityView")} />
              </Tooltip>
            ) : null}
          </div>
        ),
      },
      {
        title: "运行环境",
        dataIndex: "runtime",
        key: "runtime",
        width: 120,
        align: "center",
        sorter: true,
        sortOrder: (query.sorterField === "runtime" && query.sorterOrder) || null,
      },
      {
        title: "创建时间",
        dataIndex: "createAt",
        key: "createAt",
        width: 120,
        align: "center",
        sorter: true,
        sortOrder: (query.sorterField === "createAt" && query.sorterOrder) || null,
      },
      {
        title: "更新时间",
        dataIndex: "updateAt",
        key: "updateAt",
        width: 120,
        align: "center",
        sorter: true,
        sortOrder: (query.sorterField === "updateAt" && query.sorterOrder) || null,
      },
      {
        title: "操作",
        key: "action",
        width: 120,
        render: (_, row) => {
          return (
            <div className="g-actions-cell">
              <a onClick={() => onRemove([row.id])}>移除</a>
              <a onClick={() => onRemove([row.id])}>转存</a>
              <a onClick={() => onRemove([row.id])}>下载</a>
            </div>
          );
        },
      },
    ];
  }, [query]);

  const pagination: TablePaginationConfig = useTablePagination(entityListSummary);

  const rowSelection: TableProps<any>["rowSelection"] = useMemo(
    () => ({
      selectedRowKeys: selectedRows,
      onChange: setSelectedRows as any,
    }),
    [selectedRows],
  );

  const header = useMemo(() => {
    if (query.dir) {
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
      return (
        <div className="hd">
          {breadcrumb}
          <LinkTab links={items} />
        </div>
      );
    } else {
      return (
        <div className="hd">
          <Space>
            <div className="title">
              {shared.name}
              <small className="g-dot">
                ({entityListTotal}项 / 最多{sharedContentMax}项)
              </small>
            </div>
            {selectedRows.length ? (
              <Button
                size="small"
                color="danger"
                variant="filled"
                icon={<StarOff size={13} strokeWidth={2.5} className="anticon" />}
                onClick={() => onRemove(selectedRows)}
              >
                批量取消
              </Button>
            ) : null}
          </Space>
          <div>
            <Button
              size="small"
              type="link"
              disabled={entityListTotal >= sharedContentMax}
              onClick={() => setShowEntitySelector(true)}
              icon={<Plus size={13} strokeWidth={2.5} />}
            >
              添加文件
            </Button>
          </div>
        </div>
      );
    }
  }, [entityListTotal, sharedContentMax, onRemove, query, selectedRows, shared.name, breadcrumb]);

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
      <div className={`${styles.SharedContent} g-page min-wrap`}>
        <div className="hd" />
        <div className="bd" ref={scrollerRef}>
          <Result status="warning" title={entityQuery.error?.message || "错误"} />
        </div>
      </div>
    );
  }

  if (!entityList) {
    return (
      <div className={`${styles.SharedContent} g-page min-wrap`}>
        <div className="hd" />
        <div className="bd" ref={scrollerRef}>
          <Skeleton active />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.SharedContent} g-page min-wrap`}>
      <LoadingMask show={entityQuery.isFetching || entityDeleter.isPending || entityCreater.isPending} />
      {header}
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
        <Modal open width={1200} onCancel={closeEntitySelector} footer={null} closable={false}>
          <EntitySelector
            query={{ dir: shared.spaceDir }}
            spaceName={shared.spaceName}
            spaceDir={shared.spaceDir}
            onCancel={closeEntitySelector}
            onSubmit={submitEntitySelector}
          />
        </Modal>
      )}
    </div>
  );
};

export default memo(Component);
