import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { Pagination, Result, Segmented } from "antd";
import { SquarePlus } from "lucide-react";
import type { FC } from "react";
import { memo, useRef, useState } from "react";
import FieldSorter from "@/components/FieldSorter";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import { FlagSrc } from "@/components/utils";
import { useEvent } from "@/utils/tools";
import { FlowNodeAPI } from "../../api";
import ListItem from "../ListItem";

const StoreOptions: { label: string; value: string }[] = [
  { label: "开放平台", value: "开放平台" },
  { label: "本地仓库", value: "本地仓库" },
];

const NodeList: FC<{ query: FlowNode.IQuery }> = (props) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(props.query);
  const nodes = useQuery(FlowNodeAPI.queryList(query));
  const queryClient = useQueryClient();
  const [curEdit, setCurEdit] = useState<FlowNode.INode>();
  const nodeList = nodes.data?.list;
  const nodeListSummary = nodes.data?.summary;

  const onSearch = useEvent((keyword?: string) => {
    setQuery({ ...query, page: undefined, keyword });
  });

  const onSort = useEvent((sorter: { sorterField?: string; sorterOrder?: "ascend" | "descend" }) => {
    setQuery({ ...query, page: undefined, ...sorter });
  });

  const onPageChange = useEvent((page: number) => {
    setQuery({ ...query, page });
  });

  const onCreate = useEvent(() => {
    setCurEdit({} as FlowNode.INode);
  });

  const nodeDeleter = useMutation({
    mutationFn: FlowNodeAPI.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FlowNodeAPI.listQueryKey] });
    },
  });

  const nodeAlter = useMutation({
    mutationFn: FlowNodeAPI.editItem,
    onSuccess: (result, args) => {
      queryClient.invalidateQueries({ queryKey: [FlowNodeAPI.listQueryKey] });
      queryClient.invalidateQueries({ queryKey: [FlowNodeAPI.itemQueryKey, args.id] });
    },
  });

  const onCollect = useEvent((id: string, collected: boolean) => {
    nodeAlter.mutate({ id, collected });
  });

  const onDelete = useEvent((id: string, name: string) => {
    BaseWidgets.confirm(`确定要删除“${name}”吗？`, (ok) => {
      if (ok) {
        nodeDeleter.mutate(id);
      }
    });
  });

  // // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  // useEffect(() => {
  //   console.log("set top 0");
  //   if (scrollerRef.current) {
  //     scrollerRef.current!.scrollTop = 0;
  //   }
  // }, [query]);

  if (nodes.isError) {
    return <Result status="warning" title={nodes.error.message || "错误"} />;
  }

  if (!nodeList || !nodeListSummary) {
    return (
      <section className="g-page">
        <LoadingMask show />
      </section>
    );
  }

  return (
    <section className="g-page">
      <LoadingMask show={nodes!.isFetching} />
      <div className="hd">
        <div>
          <Segmented options={StoreOptions} />
        </div>
        <div className="space">
          <SearchInput variant="filled" onChange={onSearch} value={query.keyword} />
          <div>
            <span style={{ marginRight: 2 }}>排序：</span>
            <FieldSorter value={query} onChange={onSort} />
          </div>
        </div>
      </div>
      <div className="bd" ref={scrollerRef}>
        <div className="g-grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 2k:grid-cols-6">
          {nodeList.map((item) => {
            return <ListItem key={item.id} data={item} onDelete={onDelete} setCurEdit={setCurEdit} onCollect={onCollect} />;
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
    </section>
  );
};

export default memo(NodeList);
