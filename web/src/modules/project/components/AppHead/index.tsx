import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FC } from "react";
import { memo, useState } from "react";
import Collect from "@/components/Collect";
import Edit from "@/components/Edit";
import Flag from "@/components/Flag";
import LoadingMask from "@/components/LoadingMask";
import { useEvent, useFlowAppData, usePermissions } from "@/utils/hooks";
import { FlowAppAPI } from "../../api";
import AppEdit from "../AppEdit";
import styles from "./index.module.scss";

const AppHead: FC = () => {
  const { permissions } = usePermissions();
  const { appData } = useFlowAppData();
  const queryClient = useQueryClient();
  const [appEditor, setAppEditor] = useState<FlowApp.IApp>();

  const onEditApp = useEvent(() => {
    setAppEditor(appData);
  });

  const appAlter = useMutation({
    mutationFn: FlowAppAPI.editItem,
    onSuccess: (result, args) => {
      queryClient.invalidateQueries({ queryKey: [FlowAppAPI.listQueryKey] });
      queryClient.setQueryData<FlowApp.IApp>([FlowAppAPI.itemQueryKey, args.id], (old) => {
        return old ? { ...old, ...args } : old;
      });
    },
  });

  const onCollect = useEvent(() => {
    appAlter.mutate({ id: appData!.id, collected: !appData!.collected });
  });

  return (
    <div className={styles.AppHead}>
      <LoadingMask show={appAlter.isPending} />
      <Flag className="icon" src={appData.logo} />
      <span className="title">{appData.name}</span>
      <Collect className={`${styles.AppHead}__star`} id={appData.id} value={appData.collected} onChange={onCollect} />
      {permissions.app_edit && <Edit className={`${styles.AppHead}__edit`} onClick={onEditApp} />}
      <div className="info">{appData.desc}</div>
      <AppEdit item={appEditor} setItem={setAppEditor} />
    </div>
  );
};

export default memo(AppHead);
