import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import type { TablePaginationConfig, TableProps } from "antd";
import { Button, Dropdown, type MenuProps, Result, Skeleton, Space, Table } from "antd";
import classnames from "classnames";
import { ChevronDown, Delete, Folder, FolderClosed, Plus, TextAlignJustify, Trash2 } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import IconEntity from "@/components/IconEntity";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import { useEvent, useFolderRoute } from "@/utils/hooks";
import { debounce } from "@/utils/tools";
import { EntityAPI } from "../../api";
import styles from "./index.module.scss";

interface EntityListProps {
  query: _Entity.Query;
  title: string;
}

const Component: FC<EntityListProps> = (props) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(props.query);
  const entityQuery = useQuery(EntityAPI.queryList(query));
  const queryClient = useQueryClient();
  const router = useRouter();
  const dir = query.dir || "";
  const entityList = entityQuery.data?.list;
  const entityQuerySummary = entityQuery.data?.summary;
  const [curEdit, setCurEdit] = useState<Partial<_Entity.IEntity>>();

  useMemo(() => {
    setQuery(props.query);
  }, [props.query]);

  const resetQuery = useEvent(() => {
    return { ...query, keyword: undefined, page: undefined, sorterField: undefined, sorterOrder: undefined };
  });

  const breadcrumb = useFolderRoute(query, setQuery, resetQuery, entityQuerySummary);

  const [tableScroll, setTableScroll] = useState({ y: 0 });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const entityAlter = useMutation({
    mutationFn: EntityAPI.updateItem,
    onSuccess: (result, args) => {
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey, { dir }] });
      queryClient.invalidateQueries({ queryKey: [EntityAPI.itemQueryKey, args.id] });
    },
  });

  const entityDeleter = useMutation({
    mutationFn: EntityAPI.batchDelete,
    onSuccess: () => {
      setSelectedRows([]);
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey, { dir }] });
    },
  });

  const onSearch = useEvent((keyword?: string) => {
    router.navigate({ to: ".", search: { keyword } });
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

  const columns = useMemo<TableProps<_Entity.IEntity>["columns"]>(() => {
    return [
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        render: (name, row) => (
          <div className={classnames(`${styles.EntityList}__item`)}>
            <IconEntity type={row.type} />
            {row.type === "directory" ? (
              <Link className="dir" to="." search={{ dir: row.dir }}>
                {name}
              </Link>
            ) : row.type === "workflow" ? (
              <Link to="/workflow/$workflowId" params={{ workflowId: row.id }} search={{ dir: 1 }}>
                {name}
              </Link>
            ) : (
              <Link to="/workflow/$workflowId" params={{ workflowId: row.id }}>
                {name}
              </Link>
            )}
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
        dataIndex: "updateDate",
        key: "updateDate",
        sorter: true,
        sortOrder: (query.sorterField === "updateDate" && query.sorterOrder) || null,
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
  }, [query, onDelete]);

  const pagination: TablePaginationConfig = useMemo(
    () => ({
      className: "g-pagination",
      size: "default",
      placement: ["bottomCenter"],
      showQuickJumper: false,
      showSizeChanger: false,
      current: entityQuerySummary?.page,
      pageSize: entityQuerySummary?.pageSize,
      total: entityQuerySummary?.total,
    }),
    [entityQuerySummary],
  );

  const onTableChange = useEvent((pagination: { current?: number; pageSize?: number }, filters: any, sorter: any) => {
    console.log(pagination, filters);
    if (pagination.current) {
      router.navigate({
        to: ".",
        search: { ...query, type: undefined, page: pagination.current },
      });
    }
  });

  const rowSelection: TableProps<any>["rowSelection"] = useMemo(
    () => ({
      selectedRowKeys: selectedRows,
      onChange: setSelectedRows as any,
    }),
    [selectedRows],
  );

  useEffect(() => {
    console.log(scrollerRef.current?.offsetHeight);
    setTableScroll({ y: (scrollerRef.current?.offsetHeight || 0) - 135 });
    const onResize = debounce(() => {
      console.log(scrollerRef.current?.offsetHeight);
      setTableScroll({ y: (scrollerRef.current?.offsetHeight || 0) - 135 });
    }, 300);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const header = (
    <div className="hd">
      {breadcrumb || <div className="home">{props.title}</div>}
      <Space>
        <SearchInput value={query.keyword} onChange={onSearch} />
      </Space>
      <div className="line">
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
      </div>
      {/* {scope === "personal" ? <div /> : <div />} */}
    </div>
  );

  if (entityQuery.isError) {
    return (
      <div className={`${styles.EntityList} g-page min-wrap`}>
        {header}
        <div className="bd" ref={scrollerRef}>
          <Result status="warning" title={entityQuery.error?.message || "错误"} />
        </div>
      </div>
    );
  }

  if (!entityList) {
    return (
      <div className={`${styles.EntityList} g-page min-wrap`}>
        {header}
        <div className="bd" ref={scrollerRef}>
          <Skeleton active />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.EntityList} g-page min-wrap`}>
      <LoadingMask show={entityQuery.isFetching || entityAlter.isPending || entityDeleter.isPending} />
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
      {/* <FlowEdit item={curEdit} setItem={setCurEdit} /> */}
    </div>
  );
};

export default memo(Component);
