import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { TableProps } from "antd";
import { Button, Result, Skeleton, Table } from "antd";
import dayjs from "dayjs";
import { Link, Plus, Share2 } from "lucide-react";
import type { FC } from "react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import LoadingMask from "@/components/LoadingMask";
import { useAppStore } from "@/modules/app/store";
import SharedEdit from "@/modules/shared/views/SharedEdit";
import { useEvent } from "@/utils/hooks";
import { debounce, getSiteBasepath, sortList } from "@/utils/tools";
import { SharedAPI } from "../../api";
import styles from "./index.module.scss";

const Component: FC<{ spaceName: string; query: _Shared.Query }> = (props) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [currentEdit, setCurrentEdit] = useState<Partial<_Shared.IShared>>();
  const [tableScroll, setTableScroll] = useState({ y: 0 });
  const [config] = useAppStore(useShallow(({ config }) => [config]));
  const navigate = useNavigate();
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

  const sharedDeleter = useMutation({
    mutationFn: SharedAPI.deleteItem,
    onSuccess: () => {
      BaseWidgets.message.success("操作成功！");
      queryClient.invalidateQueries({ queryKey: [SharedAPI.listQueryKey] });
    },
  });

  const onDelete = useEvent((id: string) => {
    BaseWidgets.confirm(`确定要取消这个分享吗？`, (ok) => {
      if (ok) {
        sharedDeleter.mutate(id);
      }
    });
  });

  const copyUrl = useEvent((id: string) => {
    BaseWidgets.clipboard.write(`${getSiteBasepath()}/shared/${id}`).then(() => {
      BaseWidgets.message.success("已复制到剪贴版...");
    });
  });

  const columns = useMemo<TableProps<_Shared.IShared>["columns"]>(() => {
    return [
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        render: (name, row) => (
          <div className="g-entity-cell">
            <Share2 className="icon" size={13} />
            <a onClick={() => navigate({ to: "/shared/$sharedId", params: { sharedId: row.id } })}>{name}</a>
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
              <a onClick={() => copyUrl(row.id)}>
                <Link size={12} className="anticon" style={{ marginRight: "2px" }} />
                复制链接
              </a>
              <a onClick={() => setCurrentEdit(row)}>设置</a>
              <a onClick={() => onDelete(row.id)}>取消</a>
            </div>
          );
        },
      },
    ];
  }, [query, navigate, copyUrl, onDelete]);

  const closeCurrentEdit = useEvent(() => setCurrentEdit(undefined));

  const onCreate = useEvent(() => {
    setCurrentEdit({
      name: `${props.spaceName}的分享#${dayjs().format("YYYY-MM-DD~HH:mm")}`,
      expiration: "day",
      spaceType: props.query.spaceType,
      spaceId: props.query.spaceId,
    });
  });

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
      <LoadingMask show={sharedQuery.isFetching || sharedDeleter.isPending} />
      <div className="hd">
        <div className="title">
          {props.query.spaceType === "personal" ? "我的分享" : "项目分享"}
          <div className="tips">
            （{sharedQuery.data?.length}项<span style={{ margin: "0 2px" }}>/</span>最多{config!.sharedMax}项）
          </div>
        </div>
        <Button size="small" type="link" icon={<Plus size={14} strokeWidth={2.5} />} onClick={onCreate}>
          新建分享
        </Button>
      </div>
      <div className="bd" ref={scrollerRef}>
        <Table<any>
          rowKey="id"
          size="middle"
          className="g-table"
          columns={columns}
          dataSource={sharedList}
          pagination={false}
          scroll={tableScroll}
          onChange={onTableChange as any}
        />
      </div>
      {currentEdit && <SharedEdit item={currentEdit} onCancel={closeCurrentEdit} onSuccess={closeCurrentEdit} />}
    </div>
  );
};

export default memo(Component);
