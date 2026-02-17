import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Pagination, Result, Segmented } from "antd";
import type { FC } from "react";
import { memo, useMemo, useRef, useState } from "react";
import FieldSorter, { type SortField } from "@/components/FieldSorter";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import SkeletonCardList from "@/components/SkeletonCardList";
import { DomIds } from "@/const";
import { useEvent, useFolderRoute, usePermissions } from "@/utils/hooks";
import { NodeAPI } from "../../api";
import NodeEdit from "../NodeEdit";
import ListItem from "../NodeItem";

const StoreOptions: { label: string; value: string }[] = [
  { label: "开放平台", value: "remote" },
  { label: "当前系统", value: "local" },
];

const SorterOptions: SortField[] = ["collect", "createAt", "likes"];

const NodeList: FC<{ query: _Node.Query }> = (props) => {
  const { permissions, auth } = usePermissions();
  const router = useRouter();
  const [query, setQuery] = useState(props.query);
  useMemo(() => setQuery(props.query), [props.query]);
  const queryOptions = useMemo(() => NodeAPI.queryList(query), [query]);
  const nodes = useQuery(queryOptions);
  const nodeList = nodes.data?.list;
  const nodeListSummary = nodes.data?.summary;
  const queryClient = useQueryClient();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [curEdit, setCurEdit] = useState<_Node.INode | _Entity.IDirectory>();

  const onStoreChange = useEvent((store?: "remote" | "local") => {
    router.navigate({ to: ".", search: { store, runtime: query.runtime } });
  });
  const onSearch = useEvent((keyword?: string) => {
    setQuery({ ...query, page: undefined, keyword });
  });

  const onSort = useEvent((sorter: { sorterField?: string; sorterOrder?: "ascend" | "descend" }) => {
    setQuery({ ...query, page: undefined, ...sorter });
  });

  const onPageChange = useEvent((page: number) => {
    setQuery({ ...query, page });
  });

  const resetQuery = useEvent(() => {
    return { ...query, keyword: undefined, page: undefined, sorterField: undefined, sorterOrder: undefined };
  });

  const onCreate = useEvent(() => {
    setCurEdit({} as _Node.INode);
  });

  const nodeDeleter = useMutation({
    mutationFn: NodeAPI.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NodeAPI.listQueryKey] });
    },
  });

  const nodeAlter = useMutation({
    mutationFn: NodeAPI.editItem,
    onSuccess: (result, args) => {
      queryClient.invalidateQueries({ queryKey: [NodeAPI.listQueryKey] });
      queryClient.invalidateQueries({ queryKey: [NodeAPI.itemQueryKey, args.id] });
    },
  });

  const onCollect = useEvent((id: string, collected: boolean) => {
    //nodeAlter.mutate({ id, collected });
  });

  const onDelete = useEvent((id: string, name: string) => {
    BaseWidgets.confirm(`确定要删除“${name}”吗？`, (ok) => {
      if (ok) {
        nodeDeleter.mutate(id);
      }
    });
  });

  const onItemClick = useEvent((item: _Node.INode | _Entity.IDirectory) => {
    if (item.type === "directory") {
      setQuery({ ...query, keyword: undefined, directory: item.id });
    }
  });

  const breadcrumb = useFolderRoute(query, setQuery, resetQuery, nodeListSummary);

  const currentPath = useMemo(() => {
    const listPath = nodeListSummary?.path || [];
    let parent: string = "";
    const pathLabel: string[] = [];
    listPath.forEach(([id, title]) => {
      parent = id;
      pathLabel.push(title);
    });
    return { value: parent, label: pathLabel.join(" / ") };
  }, [nodeListSummary]);

  // // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  // useEffect(() => {
  //   console.log("set top 0");
  //   if (scrollerRef.current) {
  //     scrollerRef.current!.scrollTop = 0;
  //   }
  // }, [query]);

  if (nodes.isError) {
    return (
      <section className="g-page">
        <Result status="warning" title={nodes.error.message || "错误"} />
      </section>
    );
  }

  if (!nodeList || !nodeListSummary) {
    return (
      <section className="g-page">
        <div className="hd"></div>
        <div className="bd">
          <SkeletonCardList />
        </div>
      </section>
    );
  }

  return (
    <section className="g-page">
      <LoadingMask show={nodes!.isFetching} />
      <div className="hd">
        <div>
          <Segmented options={StoreOptions} onChange={onStoreChange as any} />
        </div>
        <div className="space">
          {breadcrumb}
          <SearchInput variant="filled" onChange={onSearch} value={query.keyword} />
          <div>
            <span style={{ marginRight: 2 }}>排序：</span>
            <FieldSorter options={SorterOptions} value={query} onChange={onSort} />
          </div>
        </div>
      </div>
      <div className="bd" ref={scrollerRef}>
        <div className="g-grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 2k:grid-cols-6">
          {nodeList.map((item) => {
            return (
              <ListItem
                key={item.id}
                item={item}
                permissions={permissions}
                authId={auth.id}
                onDelete={onDelete}
                setCurEdit={setCurEdit}
                onCollect={onCollect}
                onItemClick={onItemClick}
              />
            );
          })}
        </div>
        <Pagination
          className="g-pagination"
          align="center"
          hideOnSinglePage
          showSizeChanger={false}
          current={nodeListSummary.page}
          pageSize={nodeListSummary.pageSize}
          total={nodeListSummary.total}
          onChange={onPageChange}
        />
      </div>
      <NodeEdit item={curEdit} setItem={setCurEdit} currentPath={currentPath.label} />
      <div className="ft" style={{ display: "none" }}>
        {/* <span id={DomIds.Button_CreateNode} onClick={() => setCurEdit({ type: query.type, parent: currentPath.value } as _Node.INode)}>
          createNode
        </span>
        <span id={DomIds.Button_CreateNodeFolder} onClick={() => setCurEdit({ type: query.type, parent: currentPath.value } as _Node.INode)}>
          createFolder
        </span> */}
      </div>
    </section>
  );
};

export default memo(NodeList);
