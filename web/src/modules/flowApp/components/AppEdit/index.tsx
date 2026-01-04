import type { FC } from 'react';
import FlagSelector from '@/components/FlagSelector';
import { EditOutlined, PlusOutlined } from '@/components/Icons';
import LoadingMask from '@/components/LoadingMask';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { Button, Form, Input, Modal } from 'antd';
import { memo, useCallback } from 'react';
import { AppsAPI } from '../../api';
import styles from './index.module.scss';

const FormItem = Form.Item;

const createrTitle = (
  <>
    <PlusOutlined />
    <span>创建新应用</span>
  </>
);

const modifyTitle = (
  <>
    <EditOutlined />
    <span>修改应用信息</span>
  </>
);
export interface Props {
  setItem: (item: Apps.IApp | undefined) => void;
  item?: Apps.IApp;
}

const AppEdit: FC<Props> = ({ item, setItem }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const onCloseEdit = useCallback(() => {
    setItem(undefined);
  }, [setItem]);

  const appEdit = useMutation({
    mutationFn: AppsAPI.editItem,
    onSuccess: (result, args) => {
      setItem(undefined);
      const id = result.id;
      const isCreate = !args.id;
      queryClient.invalidateQueries({ queryKey: [AppsAPI.listQueryKey] });
      queryClient.invalidateQueries({ queryKey: [AppsAPI.itemQueryKey, id] });
      if (isCreate) {
        router.navigate({ to: '/apps/$appId/flows', params: { appId: id } });
      }
    },
  });

  return (
    <Modal open={Boolean(item)} title={item?.id ? modifyTitle : createrTitle} destroyOnClose onCancel={onCloseEdit} maskClosable={false} footer={null}>
      <LoadingMask show={appEdit.isPending} />
      <div className={styles.AppEdit}>
        <Form layout="vertical" initialValues={item} onFinish={appEdit.mutate}>
          <FormItem hidden name="id">
            <Input />
          </FormItem>
          <FormItem
            label="名称&图标"
            name="name"
            rules={[{ required: true }]}
            style={{ width: '418px' }}
          >
            <Input variant="filled" placeholder="请输入应用名称" />
          </FormItem>
          <FormItem
            name="logo"
            style={{ position: 'absolute', top: '17px', right: '0px' }}
          >
            <FlagSelector />
          </FormItem>
          <FormItem
            label="描述"
            name="desc"
          >
            <Input.TextArea
              variant="filled"
              rows={5}
              placeholder="请输入应用描述"
              showCount
              maxLength={100}
            />
          </FormItem>
          <div className="g-form-footer">
            <Button onClick={onCloseEdit}>取消</Button>
            <Button type="primary" htmlType="submit">提交</Button>
          </div>
        </Form>
      </div>
    </Modal>

  );
};

export default memo(AppEdit);
