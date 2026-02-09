import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TableProps } from "antd";
import { Button, Dropdown, Result, Skeleton, Space, Table, Tooltip } from "antd";
import { FolderSymlink, FolderTree, Link2Off, Plus, Share2, Trash2 } from "lucide-react";
import type { FC } from "react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import LoadingMask from "@/components/LoadingMask";
import { useAppStore } from "@/modules/app/store";
import { useEvent } from "@/utils/hooks";
import { debounce, openShared, sortList } from "@/utils/tools";
import { SharedAPI } from "../../api";
import styles from "./index.module.scss";

const Component: FC<{ title: string; query: _Shared.Query }> = (props) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [tableScroll, setTableScroll] = useState({ y: 0 });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [config] = useAppStore(useShallow(({ config }) => [config]));
  const queryClient = useQueryClient();
  const sharedQuery = useQuery(SharedAPI.queryList(props.query));
  const [query, setQuery] = useState<{ sorterField?: string; sorterOrder?: "ascend" | "descend" }>({});
  const sharedList = useMemo(() => {
    let list = sharedQuery.data;
    const { sorterOrder, sorterField } = query;
    if (list && sorterField && sorterOrder) {
      list = sortList(list, sorterField, sorterOrder);
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

  const columns = useMemo<TableProps<_Entity.IEntity>["columns"]>(() => {
    return [
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        render: (name, row) => (
          <div className="g-entity-cell">
            <Share2 className="icon" size={13} />
            <a onClick={() => openShared(row.id)}>{name}</a>
          </div>
        ),
      },
      {
        title: "浏览次数",
        dataIndex: "viewed",
        key: "viewed",
        width: 100,
        align: "center",
      },
      {
        title: "状态",
        dataIndex: "expiresAt",
        key: "expiresAt",
        width: 200,
        align: "center",
        sorter: true,
        sortOrder: (query.sorterField === "expiresAt" && query.sorterOrder) || null,
      },
      {
        title: "分享者",
        dataIndex: "createBy",
        key: "createBy",
        width: 120,
        ellipsis: true,
      },
      {
        title: "分享时间",
        dataIndex: "createAt",
        key: "createAt",
        width: 160,
        align: "center",
        sorter: true,
        sortOrder: (query.sorterField === "createAt" && query.sorterOrder) || null,
      },
      {
        title: "操作",
        key: "action",
        width: 160,
        render: (_, row) => {
          return (
            <div className="g-actions-cell">
              <a>修改设置</a>
              <a>取消分享</a>
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
      <div className={`${styles.SharedList} g-page min-wrap`}>
        <div className="hd" />
        <div className="bd" ref={scrollerRef}>
          <Result status="warning" title={sharedQuery.error?.message || "错误"} />
        </div>
      </div>
    );
  }

  if (!sharedList) {
    return (
      <div className={`${styles.SharedList} g-page min-wrap`}>
        <div className="hd" />
        <div className="bd" ref={scrollerRef}>
          <Skeleton active />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.SharedList} g-page min-wrap`}>
      <LoadingMask show={sharedQuery.isFetching} />
      <div className="hd">
        <Space>
          <div className="title">
            {props.title}
            <div className="tips g-dot">
              （{sharedQuery.data?.length}项<span style={{ margin: "0 2px" }}>/</span>最多{config!.sharedMax}项）
            </div>
          </div>
          {selectedRows.length ? (
            <Button size="small" color="danger" variant="filled" icon={<Link2Off size={13} strokeWidth={2.5} className="anticon" />}>
              批量取消
            </Button>
          ) : null}
        </Space>
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
