import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TableProps } from "antd";
import { Button, Dropdown, Result, Skeleton, Space, Table, Tooltip } from "antd";
import { FolderSymlink, Plus, PlusSquare, StarOff } from "lucide-react";
import type { FC } from "react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Lang from "@/assets/Lang";
import IconEntity from "@/components/IconEntity";
import LoadingMask from "@/components/LoadingMask";
import { useAppStore } from "@/modules/app/store";
import { useEvent } from "@/utils/hooks";
import { debounce, openEntity, sortList } from "@/utils/tools";
import { SharedAPI } from "../../api";
import styles from "./index.module.scss";

const Component: FC<{ id: string; title: string }> = (props) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [tableScroll, setTableScroll] = useState({ y: 0 });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [config] = useAppStore(useShallow(({ config }) => [config]));
  const queryClient = useQueryClient();
  const sharedQuery = useQuery(SharedAPI.queryContent(props.id));
  const [query, setQuery] = useState<{ sorterField?: string; sorterOrder?: "ascend" | "descend" }>({});
  const sharedList = useMemo(() => {
    let list = sharedQuery.data;
    const { sorterOrder, sorterField } = query;
    if (list) {
      if (sorterField && sorterOrder) {
        list = sortList(list, sorterField, sorterOrder);
      } else {
        list = sortList(list, "type", "ascend");
      }
    }
    return list;
  }, [sharedQuery.data, query]);

  const onTableChange = useEvent(
    (_pagination: { current?: number; pageSize?: number }, _filters: any, sorter?: { field: string; order: "ascend" | "descend" }) => {
      if (sorter) {
        setQuery({ sorterField: sorter.field, sorterOrder: sorter.order });
      }
    },
  );

  const sharedDeleter = useMutation({
    mutationFn: SharedAPI.batchDeleteContentItem,
    onSuccess: () => {
      setSelectedRows([]);
      queryClient.invalidateQueries({ queryKey: [SharedAPI.contentQueryKey, props.id] });
    },
  });

  const onRemove = useEvent((ids: string[]) => sharedDeleter.mutate({ sharedId: props.id, entityIds: ids }));

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
            <a onClick={() => openEntity(row, false, "favorite")}>{name}</a>
            {row.path ? (
              <Tooltip placement="bottom" title={row.path.replace(/\/.+? /g, "/").replace(/\/[^/]+?$/, "") || "/"}>
                <FolderSymlink className="dir anticon" type="directory" size={13} onClick={() => openEntity(row, true, "favorite")} />
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
        title: "创建日期",
        dataIndex: "createAt",
        key: "createAt",
        width: 120,
        align: "center",
        sorter: true,
        sortOrder: (query.sorterField === "createAt" && query.sorterOrder) || null,
      },
      {
        title: "更新日期",
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

  if (sharedQuery.isError) {
    return (
      <div className={`${styles.SharedContent} g-page min-wrap`}>
        <div className="hd" />
        <div className="bd" ref={scrollerRef}>
          <Result status="warning" title={sharedQuery.error?.message || "错误"} />
        </div>
      </div>
    );
  }

  if (!sharedList) {
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
      <LoadingMask show={sharedQuery.isFetching} />
      <div className="hd">
        <Space>
          <div className="title">
            {props.title}
            <small className="g-dot">
              ({sharedQuery.data?.length}项 / 最多{config!.sharedContentMax}项)
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
          <Button size="small" type="link" icon={<Plus size={13} strokeWidth={2.5} />}>
            添加文件
          </Button>
        </div>
      </div>
      <div className="bd" ref={scrollerRef}>
        <Table<any>
          rowKey="id"
          size="middle"
          className="g-table"
          columns={columns}
          dataSource={sharedList}
          pagination={false}
          rowSelection={rowSelection}
          scroll={tableScroll}
          onChange={onTableChange as any}
        />
      </div>
    </div>
  );
};

export default memo(Component);
