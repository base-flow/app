import type { CreatorPayload, GraphData, IGraph, IGraphOptions, INodeData } from "@baseflow/react";
import { DefalutGraphHooks, DslTools, Flow, HistoryTools, NodeType } from "@baseflow/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import type { MenuProps } from "antd";
import { Button, Modal, Result, Skeleton } from "antd";
import { ArrowLeft, PlusCircle, Tag } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useState } from "react";
import Lang from "@/assets/Lang";
import LoadingMask from "@/components/LoadingMask";
import NodeSelector from "@/modules/entity/views/NodeSelector";
import { useConfig, useEvent } from "@/utils/hooks";
import { GraphHooks } from "./GraphHooks";
import Header from "./Header";
import styles from "./index.module.scss";

const items: MenuProps["items"] = [
  {
    key: "2",
    className: "btn",
    label: "创建新版本",
    icon: <PlusCircle size={13} />,
  },
  {
    key: "1",
    className: "btn pub",
    label: "发布正式版",
    icon: <PlusCircle size={13} />,
    extra: "v0.0.1",
  },
  {
    key: "2",
    type: "divider",
  },
  {
    key: "v1.0.1-dev",
    label: "v1.0.1-dev",
    icon: <Tag size={13} />,
  },
  {
    key: "4",
    label: "v1.0.2-dev",
    icon: <Tag size={13} />,
  },
  {
    key: "5",
    label: "v1.0.3",
    icon: <Tag size={13} />,
  },
];

export interface Props {
  item: _Workflow.IWorkflow & _Workflow.IWorkflowDetail;
  graphData: GraphData;
}

const WorkflowItem: FC<Props> = ({ item, graphData }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { config } = useConfig();
  const [initGraphData] = useState(graphData);
  const [graphOptions] = useState<IGraphOptions>({});
  const [graphHooks] = useState(new GraphHooks(item));
  const [graph, setGraph] = useState<IGraph>();
  const [showNodeCreater, setShowNodeCreater] = useState<CreatorPayload>();

  const closeNodeCreater = useEvent(() => setShowNodeCreater(undefined));

  const onInit = useCallback((graph: IGraph) => {
    // @ts-expect-error: dev test
    window.graph = graph;
    setGraph(graph);
  }, []);

  return (
    <div className={styles.WorkflowItem}>
      <LoadingMask show={false} />
      <Header item={item} graph={graph} />
      <div className="bd">
        <Flow options={graphOptions} initialData={initGraphData} graphHooks={graphHooks} onInit={onInit} onShowCreater={setShowNodeCreater} />
      </div>
      {showNodeCreater && (
        <Modal open={true} width={1200} title={null} footer={null} onCancel={closeNodeCreater}>
          <NodeSelector
            rootDir={config!.dirs.node[item.runtime]}
            rootName={Lang.runtime[item.runtime]}
            query={{ dir: config!.dirs.node[item.runtime] }}
          />
        </Modal>
      )}
    </div>
  );
};

export default memo(WorkflowItem);
