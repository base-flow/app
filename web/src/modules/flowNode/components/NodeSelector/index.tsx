import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import classnames from "classnames";
import type { FC, MouseEvent } from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEvent, useInfiniteList } from "@/utils/tools";
import { FlowNodeAPI } from "../../api";

export interface NodeSelectorProps {
  query?: FlowNode.IQuery;
  selector?: boolean;
  onPasteNode?: () => void;
  onApplyNode?: (node: FlowNode.INode, version: string) => void;
}

const NodeList: FC<NodeSelectorProps> = (props) => {
  const { selector, onApplyNode, onPasteNode, renderListData } = props;
  const [query, setQuery] = useState(props.query);
  const nodes = useInfiniteQuery<FlowNode.IQueryResult>(FlowNodeAPI.queryInfiniteList(query));
  const nodesPages = nodes.data?.pages;
  const [scrollerRef, loaderRef] = useInfiniteList(nodes.fetchNextPage);

  const [nodeList] = useMemo(() => {
    const list: FlowNode.INode[] = [];
    let summary: App.ISummary | undefined;
    nodesPages?.forEach((page) => {
      page.list.forEach((node) => {
        list.push(node);
      });
      if (!summary) {
        summary = page.summary;
      }
    });
    return [list, summary];
  }, [nodesPages]);

  const onSearch = useEvent((keyword?: string) => {
    scrollerRef.current!.scrollTop = 0;
    setQuery({ ...query, keyword });
  });

  const onSort = useEvent((sorter: { sorterField?: string; sorterOrder?: "ascend" | "descend" }) => {
    scrollerRef.current!.scrollTop = 0;
    setQuery({ ...query, ...sorter });
  });
};

export default memo(NodeList);
