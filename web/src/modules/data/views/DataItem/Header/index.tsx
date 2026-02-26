import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { Button, Spin } from "antd";
import { ArrowLeft, Edit } from "lucide-react";
import type { FC, ReactNode } from "react";
import { memo, useState } from "react";
import Collect from "@/components/Collect";
import IconEntity from "@/components/IconEntity";
import DataEdit from "@/modules/entity/views/DataEdit";
import { useEvent, useMyFavoriteIds } from "@/utils/hooks";
import styles from "./index.module.scss";

export interface Props {
  item: _Data.IData & _Data.IDataDetail;
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
    <div className={styles.DataItemHeader}>
      <div className="left">
        <Button size="small" type="text" icon={<ArrowLeft size={14} strokeWidth={2.5} />} onClick={onBack}></Button>
        <IconEntity type={item.type} size={14} />
        <span className="title">{item.name}</span>
        <span className="type">(Data)</span>
        <Edit className="edit" size={13} onClick={() => setCurrentEdit(true)} />
        <Collect id={item.id} value={favoriteMap[item.id]} onChange={onFavoriteChange} />
        {favoriteLoading && <Spin size="small" />}
      </div>
      <div className="right">{children}</div>
      {currentEdit && <DataEdit item={item} onCancel={closeCurrentEdit} onSuccess={closeCurrentEdit} />}
    </div>
  );
};

export default memo(NodeItemHeader);
