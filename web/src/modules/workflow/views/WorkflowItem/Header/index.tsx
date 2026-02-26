import type { IGraph } from "@baseflow/react";
import { HistoryTools } from "@baseflow/react";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import type { MenuProps } from "antd";
import { Button, Dropdown, Spin } from "antd";
import { ArrowLeft, Edit, PlusCircle, Tag } from "lucide-react";
import type { FC } from "react";
import { memo, useState } from "react";
import Collect from "@/components/Collect";
import IconEntity from "@/components/IconEntity";
import WorkflowEdit from "@/modules/entity/views/WorkflowEdit";
import { useEvent, useMyFavoriteIds } from "@/utils/hooks";
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
  graph: IGraph | undefined;
  item: _Workflow.IWorkflow & _Workflow.IWorkflowDetail;
}

const WorkflowItemHeader: FC<Props> = ({ item, graph }) => {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const [currentEdit, setCurrentEdit] = useState(false);
  const { favoriteMap, onFavoriteChange, favoriteLoading } = useMyFavoriteIds();

  const onBack = useEvent(() => {
    if (canGoBack) {
      router.history.back();
    } else {
      if (item.spaceType === "personal") {
        router.navigate({ to: "/personal/$personalId", params: { personalId: item.spaceId } });
      } else if (item.spaceType === "project") {
        router.navigate({ to: "/project/$projectId", params: { projectId: item.spaceId } });
      } else if (item.spaceType === "platform") {
        router.navigate({ to: `/platform/${item.spaceId}` });
      }
    }
  });

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
        <Button size="small" type="text" icon={<ArrowLeft size={14} strokeWidth={2.5} />} onClick={onBack}></Button>
        <IconEntity type={item.type} size={14} />
        <span className="title">{item.name}</span>
        <span className="type">(Workflow)</span>
        <Edit className="edit" size={13} onClick={() => setCurrentEdit(true)} />
        <Collect id={item.id} value={favoriteMap[item.id]} onChange={onFavoriteChange} />
        {favoriteLoading && <Spin size="small" />}
      </div>
      <div className="right">
        {graph && <HistoryTools graph={graph} />}
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
