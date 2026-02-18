import type { IGraph } from "@baseflow/react";
import { DefalutGraphHooks, DslTools, Flow, HistoryTools, NodeType } from "@baseflow/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import type { MenuProps } from "antd";
import { Button, Dropdown, Result, Skeleton } from "antd";
import { Edit, PlusCircle, Tag } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Lang from "@/assets/Lang";
import Pathcrumb from "@/components/Pathcrumb";
import { useAppStore } from "@/modules/app/store";
import WorkflowEdit from "@/modules/entity/views/WorkflowEdit";
import { useEvent } from "@/utils/hooks";
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
  item: _Workflow.IWorkflow;
}

const WorkflowItemHeader: FC<Props> = ({ item }) => {
  const router = useRouter();
  const [config] = useAppStore(useShallow(({ config }) => [config]));
  const queryClient = useQueryClient();
  const [currentEdit, setCurrentEdit] = useState(false);
  const rootName =
    item.spaceType === "personal" ? "我的文档" : item.spaceType === "project" ? "项目文档" : Lang.entityDirName[`workflow.${item.runtime}`];

  const onBreadcrumbRoute = useEvent((path: string) => {
    if (path) {
      const dir = path === "/" ? item.spaceDir : path;
      const href = `${window.BASE_PATH || ""}/${item.spaceType}/${item.spaceId}${dir === item.spaceDir ? "" : `?dir="${dir}"`}`;
      window.open(href);
    } else {
      setCurrentEdit(true);
    }
  });

  const breadcrumb = useMemo(() => {
    const pathData = item.path
      ? item.path
          .split("/")
          .filter(Boolean)
          .map((item) => item.split(" "))
      : [];
    if (pathData[0]) {
      pathData[0] = ["/", rootName];
    }
    const pathString = pathData.map((item) => item[0]).join(" ");

    const items = pathString ? pathData.map(([id, title]) => ({ path: id, title })) : [];
    return (
      <Pathcrumb items={items} showBack={false} refreshIcon={<Edit className="anticon" strokeWidth={2.5} size={12} />} onRoute={onBreadcrumbRoute} />
    );
  }, [item.path, rootName, onBreadcrumbRoute]);

  const [versionsMenu, setVersionsMenu] = useState(() => ({
    items,
    selectedKeys: ["v1.0.1-dev"],
    className: `${styles.Canvas}__ver-menu`,
    offset: [15, 12],
  }));

  const closeCurrentEdit = useEvent(() => setCurrentEdit(false));

  return (
    <div className={styles.WorkflowItemHeader}>
      <div className="left">
        {/* <Link className="link-btn" to="/apps/$appId/flows" params={{ appId: flowData.appId! }}>
            <MenuOutlined />
          </Link> */}
        {breadcrumb}
      </div>
      <div className="right">
        <Dropdown menu={versionsMenu} align={versionsMenu}>
          <Button type="text" size="small" icon={<Tag size={13} />}>
            v0.0.1-dev
          </Button>
        </Dropdown>
      </div>
      {currentEdit && <WorkflowEdit item={item} onCancel={closeCurrentEdit} onSuccess={closeCurrentEdit} />}
    </div>
  );
};

export default memo(WorkflowItemHeader);
