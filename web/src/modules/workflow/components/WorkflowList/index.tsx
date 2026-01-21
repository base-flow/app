import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import type { TablePaginationConfig, TableProps } from "antd";
import { Button, Dropdown, type MenuProps, Result, Skeleton, Space, Table } from "antd";
import { ChevronDown, Delete, GitMerge, GitPullRequest, Plus, TextAlignJustify, Trash2 } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import PersonalHead from "@/modules/personal/components/PersonalHead";
import ProjectHead from "@/modules/project/components/ProjectHead";
import { useEvent } from "@/utils/hooks";
import { debounce } from "@/utils/tools";
import { WorkflowAPI } from "../../api";
import styles from "./index.module.scss";

interface WorkflowListProps {
  query: _Workflow.Query;
  scope: _App.Scope;
}

const Component: FC<WorkflowListProps> = (props) => {
  const { scope } = props;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(props.query);
  const workflowQuery = useQuery(WorkflowAPI.queryList(query));
  const queryClient = useQueryClient();
  const router = useRouter();
  const directoryId = query.directory || "";
  const workflowList = workflowQuery.data?.list;
  const workflowQuerySummary = workflowQuery.data?.summary;

  useMemo(() => {
    setQuery(props.query);
  }, [props.query]);

  const [tableScroll, setTableScroll] = useState({ y: 0 });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [curEdit, setCurEdit] = useState<Partial<_Workflow.IWorkflow>>();

  const workflowAlter = useMutation({
    mutationFn: WorkflowAPI.editItem,
    onSuccess: (result, args) => {
      queryClient.invalidateQueries({ queryKey: [WorkflowAPI.listQueryKey, { directoryId }] });
      queryClient.invalidateQueries({ queryKey: [WorkflowAPI.itemQueryKey, args.id] });
    },
  });

  const workflowDeleter = useMutation({
    mutationFn: WorkflowAPI.batchDelete,
    onSuccess: () => {
      setSelectedRows([]);
      queryClient.invalidateQueries({ queryKey: [WorkflowAPI.listQueryKey, { directoryId }] });
    },
  });

  const onSearch = useEvent((keyword?: string) => {
    router.navigate({ to: ".", search: { keyword } });
  });

  const onCreate = useEvent(() => {
    setCurEdit({ directoryId });
  });

  const onDelete = useEvent((id: string, name: string) => {
    BaseWidgets.confirm(`确定要删除“${name}”吗？`, (ok) => {
      if (ok) {
        workflowDeleter.mutate([id]);
      }
    });
  });

  const onBatchDelete = useEvent((ids: string[]) => {
    BaseWidgets.confirm(`确定要删除选中的“${ids.length}”项吗？`, (ok) => {
      if (ok) {
        workflowDeleter.mutate(ids);
      }
    });
  });

  const onToTemplate = useCallback(
    (id: string, name: string, templated: boolean) => {
      BaseWidgets.confirm(
        `《${name}》${templated ? "共享为模版后，该流程内所有节点及连接配置将公开可见，请注意去除敏感信息和配置账号！" : "取消共享为模版后，将不在出现在模版列表中，但不影响已基于此模版创建的流程！"}`,
        (ok) => {
          if (ok) {
            workflowAlter.mutate({ id });
          }
        },
        templated
          ? { title: "确定要共享为模版吗？", okText: "确定共享", cancelText: "放弃操作" }
          : { title: "确定要取消共享为模版吗？", okText: "确定取消", cancelText: "放弃操作" },
      );
    },
    [workflowAlter],
  );

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

  const columns = useMemo<TableProps<_Workflow.IWorkflow>["columns"]>(() => {
    return [
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        render: (name, row) => (
          <div className={`${styles.WorkflowList}__item`}>
            <TextAlignJustify className="doc-icon" size={13} />
            <Link to="/workflow/$workflowId" params={{ workflowId: row.id }}>
              {name}
            </Link>
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
      current: workflowQuerySummary?.page,
      pageSize: workflowQuerySummary?.pageSize,
      total: workflowQuerySummary?.total,
    }),
    [workflowQuerySummary],
  );

  const onTableChange = useEvent((pagination: { current?: number; pageSize?: number }, filters: any, sorter: any) => {
    console.log(pagination, filters);
    if (pagination.current) {
      router.navigate({ to: "/", search: { ...query, appId: undefined, page: pagination.current } });
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
    setTableScroll({ y: (scrollerRef.current?.scrollHeight || 0) - 135 });
    const onResize = debounce(() => setTableScroll({ y: (scrollerRef.current?.scrollHeight || 0) - 135 }), 300);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (workflowQuery.isError) {
    return (
      <div className={`${styles.WorkflowList} g-page min-wrap`}>
        <div className="hd">{scope === "personal" ? <PersonalHead /> : <ProjectHead />}</div>
        <div className="bd">
          <Result status="warning" title={workflowQuery.error?.message || "错误"} />
        </div>
      </div>
    );
  }

  if (!workflowList) {
    return (
      <div className={`${styles.WorkflowList} g-page min-wrap`}>
        <div className="hd">{scope === "personal" ? <PersonalHead /> : <ProjectHead />}</div>
        <div className="bd">
          <Skeleton active />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.WorkflowList} g-page min-wrap`}>
      <LoadingMask show={workflowQuery.isFetching || workflowAlter.isPending || workflowDeleter.isPending} />
      <div className="hd">
        {scope === "personal" ? <PersonalHead /> : <ProjectHead />}
        {!selectedRows.length ? (
          <Space>
            <SearchInput value={query.keyword} onChange={onSearch} />
            <Button icon={<Plus size={14} strokeWidth={2.5} className="anticon" />} type="primary" onClick={() => onCreate()}>
              新建流程
            </Button>
          </Space>
        ) : (
          <Dropdown menu={batchMenu}>
            <Button loading={workflowDeleter.isPending} icon={<ChevronDown size={13} className="anticon" />} iconPlacement="end">
              批量操作
            </Button>
          </Dropdown>
        )}
      </div>
      <div className="bd" ref={scrollerRef}>
        <Table<any>
          rowKey="id"
          size="middle"
          className="g-table"
          columns={columns}
          dataSource={workflowList}
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
