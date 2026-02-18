import type { IGraph } from "@baseflow/react";
import { DefalutGraphHooks, DslTools, Flow, HistoryTools, NodeType } from "@baseflow/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import type { MenuProps } from "antd";
import { Button, Dropdown, Result, Skeleton } from "antd";
import { ArrowLeft, PlusCircle, Tag } from "lucide-react";
import type { FC } from "react";
import { memo, useState } from "react";
import LoadingMask from "@/components/LoadingMask";
import { EntityAPI } from "@/modules/entity/api";
import { useEvent } from "@/utils/hooks";
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
  id: string;
}

const WorkflowItem: FC<Props> = ({ id }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const canGoBack = useCanGoBack();
  const workflowQuery = useQuery(EntityAPI.queryItem(id));
  const workflowData = workflowQuery.data as _Workflow.IWorkflow;
  const [graph, setGraph] = useState<IGraph>();
  const [versionsMenu, setVersionsMenu] = useState(() => ({
    items,
    selectedKeys: ["v1.0.1-dev"],
    className: `${styles.Canvas}__ver-menu`,
    offset: [15, 12],
  }));

  const onBack = useEvent(() => {
    if (canGoBack) {
      router.history.back();
    } else {
      router.navigate({ to: "/platform" });
    }
  });

  if (workflowQuery.isError) {
    return (
      <section>
        <Result status="warning" title={workflowQuery.error?.message || "错误"} />
      </section>
    );
  }

  if (!workflowData) {
    return (
      <section>
        <Skeleton className="loading" active />
      </section>
    );
  }

  return (
    <div className={styles.WorkflowItem}>
      <LoadingMask show={workflowQuery.isFetching} />
      <div className={`${styles.WorkflowItem}__hd`}>
        <div className="left">
          {/* <Link className="link-btn" to="/apps/$appId/flows" params={{ appId: flowData.appId! }}>
            <MenuOutlined />
          </Link> */}
          <Header item={workflowData} />
          <div className="title">
            <span>{workflowData.name}</span>
          </div>
        </div>
        <div className="right">
          {graph && <HistoryTools graph={graph} />}
          <Dropdown menu={versionsMenu} align={versionsMenu}>
            <Button type="text" size="small" icon={<Tag size={13} />}>
              v0.0.1-dev
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default memo(WorkflowItem);
