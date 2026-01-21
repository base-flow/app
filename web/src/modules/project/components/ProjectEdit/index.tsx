import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Button, Form, Input, Modal } from "antd";
import { Pencil, Plus } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback } from "react";
import FlagSelector from "@/components/FlagSelector";
import LoadingMask from "@/components/LoadingMask";
import { ProjectAPI } from "../../api";
import styles from "./index.module.scss";

const FormItem = Form.Item;

const createrTitle = (
  <>
    <Plus className="anticon" size={15} strokeWidth={3} />
    <span>创建新项目</span>
  </>
);

const modifyTitle = (
  <>
    <Pencil className="anticon" size={13} strokeWidth={3} />
    <span>修改项目信息</span>
  </>
);
export interface Props {
  setItem: (item: _Project.IProject | undefined) => void;
  item?: _Project.IProject;
}

const Component: FC<Props> = ({ item, setItem }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const onCloseEdit = useCallback(() => {
    setItem(undefined);
  }, [setItem]);

  const projectEdit = useMutation({
    mutationFn: ProjectAPI.editItem,
    onSuccess: (result, args) => {
      setItem(undefined);
      const id = result.id;
      const isCreate = !args.id;
      queryClient.invalidateQueries({ queryKey: [ProjectAPI.listQueryKey] });
      queryClient.invalidateQueries({ queryKey: [ProjectAPI.itemQueryKey, id] });
      if (isCreate) {
        router.navigate({ to: "/project/$projectId/flows", params: { projectId: id } });
      }
    },
  });

  return item ? (
    <Modal open title={item.id ? modifyTitle : createrTitle} onCancel={onCloseEdit} maskClosable={false} footer={null}>
      <div className={styles.ProjectEdit}>
        <LoadingMask show={projectEdit.isPending} />
        <Form layout="vertical" initialValues={item} onFinish={projectEdit.mutate}>
          <FormItem hidden name="id">
            <Input />
          </FormItem>
          <FormItem label="名称&图标" name="name" rules={[{ required: true }]} style={{ width: "418px" }}>
            <Input variant="filled" placeholder="请输入应用名称" />
          </FormItem>
          <FormItem name="logo" style={{ position: "absolute", top: "17px", right: "0px" }}>
            <FlagSelector />
          </FormItem>
          <FormItem label="应用描述" name="desc" rules={[{ required: true }]}>
            <Input.TextArea variant="filled" rows={5} placeholder="请输入应用描述" showCount maxLength={100} />
          </FormItem>
          <div className="g-form-footer">
            <Button onClick={onCloseEdit}>取消</Button>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  ) : null;
};

export default memo(Component);
