import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { Button, Spin } from "antd";
import { ArrowLeft, Edit } from "lucide-react";
import type { FC, ReactNode } from "react";
import { memo, useState } from "react";
import Collect from "@/components/Collect";
import IconNodeKind from "@/components/IconNodeKind";
import { DefaultNodeIcon } from "@/const";
import NodeEdit from "@/modules/entity/views/NodeEdit";
import { useEvent, useMyFavoriteIds } from "@/utils/hooks";
import styles from "./index.module.scss";

export interface Props {
  item: _Node.INode & _Node.INodeDetail;
  children: ReactNode;
}

const NodeItemHeader: FC<Props> = ({ item, children }) => {
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

  const closeCurrentEdit = useEvent(() => setCurrentEdit(false));

  return (
    <div className={styles.NodeItemHeader}>
      <div className="left">
        <Button size="small" type="text" icon={<ArrowLeft size={14} />} onClick={onBack}></Button>
        {item.kind !== "snippet" && <img width={22} height={22} className="icon" alt="node" src={item.icon || DefaultNodeIcon} />}
        <span className="title">{item.name}</span>
        <span className="type">
          (<span style={{ marginRight: "3px" }}>Node</span>
          <IconNodeKind className="kind" kind={item.kind} showLabel size={13} />)
        </span>
        <Edit className="edit" size={13} onClick={() => setCurrentEdit(true)} />
        <Collect id={item.id} value={favoriteMap[item.id]} onChange={onFavoriteChange} />
        {favoriteLoading && <Spin size="small" />}
      </div>
      <div className="right">{children}</div>
      {currentEdit && <NodeEdit item={item} onCancel={closeCurrentEdit} onSuccess={closeCurrentEdit} />}
    </div>
  );
};

export default memo(NodeItemHeader);
