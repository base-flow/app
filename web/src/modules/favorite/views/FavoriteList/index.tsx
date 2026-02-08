import { Link, useNavigate } from "@tanstack/react-router";
import type { MenuProps, TableProps } from "antd";
import { Button, Dropdown, Result, Skeleton, Space, Table, Tooltip } from "antd";
import classnames from "classnames";
import { Delete, FolderSymlink, FolderTree, Plus, StarOff, Trash2 } from "lucide-react";
import type { FC } from "react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Lang from "@/assets/Lang";
import Collect from "@/components/Collect";
import IconEntity from "@/components/IconEntity";
import type { LinkItem } from "@/components/LinkTab";
import LinkTab from "@/components/LinkTab";
import LoadingMask from "@/components/LoadingMask";
import { useAppStore } from "@/modules/app/store";
import { useEvent, useMyFavoriteList } from "@/utils/hooks";
import { debounce, openEntity, sortList } from "@/utils/tools";
import styles from "./index.module.scss";

const Component: FC<{}> = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [tableScroll, setTableScroll] = useState({ y: 0 });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [config] = useAppStore(useShallow(({ config }) => [config]));
  const { favoriteQuery, onFavoriteChange, onFavoriteRemove } = useMyFavoriteList(() => setSelectedRows([]));
  const [query, setQuery] = useState<{ type?: _App.EntryFileType; sorterField?: string; sorterOrder?: "ascend" | "descend" }>({});
  const favoriteList = useMemo(() => {
    let list = favoriteQuery.data;
    const { type, sorterOrder, sorterField } = query;
    if (list && type) {
      list = list.filter((item) => item.type === type);
    }
    if (list) {
      if (sorterField && sorterOrder) {
        list = sortList(list, sorterField, sorterOrder);
      } else {
        list = sortList(list, "type", "ascend");
      }
    }
    return list;
  }, [favoriteQuery.data, query]);

  const onListTypeTo = useEvent((item: LinkItem) => setQuery({ type: item.key === "all" ? undefined : (item.key as _App.EntryFileType) }));

  const listTypeLinks = useMemo(() => {
    const items: LinkItem[] = [
      {
        key: "all",
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
        className: query.type === "node" ? "on" : undefined,
        children: (
          <>
            <IconEntity size={12} type="node" />
            <span>节点</span>
          </>
        ),
      },
    ];
    return <LinkTab links={items} onTo={onListTypeTo} />;
  }, [query, onListTypeTo]);

  const onTableChange = useEvent(
    (_pagination: { current?: number; pageSize?: number }, _filters: any, sorter?: { field: string; order: "ascend" | "descend" }) => {
      if (sorter) {
        setQuery({ ...query, sorterField: sorter.field, sorterOrder: sorter.order });
      }
    },
  );

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
            <a onClick={() => openEntity(row, false, "EntityView")}>{name}</a>
            {row.path ? (
              <Tooltip placement="bottom" title={row.path.replace(/\/.+? /g, "/").replace(/\/[^/]+?$/, "") || "/"}>
                <FolderSymlink className="dir anticon" type="directory" size={13} onClick={() => openEntity(row, true, "EntityView")} />
              </Tooltip>
            ) : null}
            <Collect id={row.id} value={true} onChange={onFavoriteChange} />
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
        title: "所属空间",
        dataIndex: "spaceType",
        key: "spaceType",
        width: 120,
        align: "center",
        sorter: true,
        sortOrder: (query.sorterField === "spaceType" && query.sorterOrder) || null,
        render: (spaceType: _App.EntrySpace) => Lang.spaceType[spaceType],
      },
      {
        title: "操作",
        key: "action",
        width: 80,
        render: (_, row) => {
          return (
            <div className="g-actions-cell">
              <a onClick={() => onFavoriteChange(row.id, false)}>取消</a>
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

  if (favoriteQuery.isError) {
    return (
      <div className={`${styles.FavoriteList} g-page min-wrap`}>
        <div className="hd" />
        <div className="bd" ref={scrollerRef}>
          <Result status="warning" title={favoriteQuery.error?.message || "错误"} />
        </div>
      </div>
    );
  }

  if (!favoriteList) {
    return (
      <div className={`${styles.FavoriteList} g-page min-wrap`}>
        <div className="hd" />
        <div className="bd" ref={scrollerRef}>
          <Skeleton active />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.FavoriteList} g-page min-wrap`}>
      <LoadingMask show={favoriteQuery.isFetching} />
      <div className="hd">
        <Space>
          <div className="title">
            我的收藏
            <small className="g-dot">
              ({favoriteQuery.data?.length}项 / 最多{config!.favMax}项)
            </small>
          </div>
          {selectedRows.length ? (
            <Button
              size="small"
              color="danger"
              variant="filled"
              icon={<StarOff size={13} strokeWidth={2.5} className="anticon" />}
              onClick={() => onFavoriteRemove(selectedRows)}
            >
              批量取消
            </Button>
          ) : null}
        </Space>
        {listTypeLinks}
      </div>
      <div className="bd" ref={scrollerRef}>
        <Table<any>
          rowKey="id"
          size="middle"
          className="g-table"
          columns={columns}
          dataSource={favoriteList}
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
