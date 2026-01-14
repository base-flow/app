import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Result } from "antd";
import type { FC } from "react";
import { memo, useCallback, useState } from "react";
import Collect from "@/components/Collect";
import Edit from "@/components/Edit";
import ErrorPanel from "@/components/ErrorPanel";
import Flag from "@/components/Flag";
import LoadingMask from "@/components/LoadingMask";
import { useEvent } from "@/utils/hooks";
import { FlowAppAPI } from "../../api";
import AppEdit from "../AppEdit";
import styles from "./index.module.scss";

export interface Props {
  appId: string;
}

const AppHead: FC<Props> = ({ appId }) => {
  const queryClient = useQueryClient();
  const app = useQuery(FlowAppAPI.queryItem(appId));
  const appData = app.data;
  const [appEditor, setAppEditor] = useState<FlowApp.IApp>();

  const onEditApp = useEvent(() => {
    setAppEditor(appData);
  });

  const appAlter = useMutation({
    mutationFn: FlowAppAPI.editItem,
    onSuccess: (result, args) => {
      queryClient.invalidateQueries({ queryKey: [FlowAppAPI.listQueryKey] });
      queryClient.invalidateQueries({ queryKey: [FlowAppAPI.itemQueryKey, args.id] });
    },
  });

  const onCollect = useEvent(() => {
    appAlter.mutate({ id: appData!.id, collected: !appData!.collected });
  });

  if (app.isError) {
    return (
      <div className={styles.AppHead}>
        <ErrorPanel message={app.error?.message || "错误"} />
      </div>
    );
  }

  if (!appData) {
    return (
      <div className={styles.AppHead}>
        <LoadingMask show />
      </div>
    );
  }

  return (
    <div className={styles.AppHead}>
      <LoadingMask show={app.isFetching} />
      <Flag className="icon" src={appData.logo} />
      <span className="title">{appData.name}</span>
      <Collect className={`${styles.AppHead}__star`} id={appData.id} value={appData.collected} onChange={onCollect} />
      <Edit className={`${styles.AppHead}__edit`} onClick={onEditApp} />
      <div className="info">{appData.desc}</div>
      <AppEdit item={appEditor} setItem={setAppEditor} />
    </div>
  );
};

export default memo(AppHead);
