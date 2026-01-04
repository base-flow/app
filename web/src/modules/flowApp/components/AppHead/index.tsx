import type { FC } from 'react';
import Flag from '@/components/Flag';
import { EditFilled } from '@/components/Icons';
import LoadingMask from '@/components/LoadingMask';
import Star from '@/components/Star';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Result } from 'antd';
import { memo, useCallback, useState } from 'react';
import { AppsAPI } from '../../api';
import AppEdit from '../AppEdit';
import styles from './index.module.scss';

export interface Props {
  appId: string;
}

const AppHead: FC<Props> = ({ appId }) => {
  const queryClient = useQueryClient();
  const app = useQuery(AppsAPI.queryItem(appId));
  const appData = app.data;
  const [appEditor, setAppEditor] = useState<Apps.IApp>();

  const onEditApp = useCallback(() => {
    const app = appData;
    if (app) {
      setAppEditor(app);
    }
  }, [appData]);

  const appAlter = useMutation({
    mutationFn: AppsAPI.editItem,
    onSuccess: (result, args) => {
      queryClient.invalidateQueries({ queryKey: [AppsAPI.listQueryKey] });
      queryClient.invalidateQueries({ queryKey: [AppsAPI.itemQueryKey, args.id] });
    },
  });

  const onCollect = useCallback((collected: boolean, id: string) => {
    appAlter.mutate({ id, collected });
  }, [appAlter]);

  if (app.isError) {
    return (
      <Result
        status="warning"
        title={app.error?.message || '错误'}
      />
    );
  }

  if (!appData) {
    return <LoadingMask show={true} />;
  }

  return (
    <div className={styles.AppHead}>
      <LoadingMask show={app.isFetching} />
      <aside>
        <Flag className="icon" src={appData.logo} />
        <h2 className="title g-h3">
          <span>{appData.name}</span>
          <Star
            className={`${styles.AppHead}__star`}
            id={appData.id}
            value={appData.collected}
            onChange={onCollect}
          />
          <EditFilled className={`${styles.AppHead}__edit`} onClick={onEditApp} />
        </h2>
        <span className="info">{appData.updateDate}</span>
      </aside>
      <AppEdit item={appEditor} setItem={setAppEditor} />
    </div>
  );
};

export default memo(AppHead);
