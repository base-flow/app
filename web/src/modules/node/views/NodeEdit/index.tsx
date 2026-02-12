import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal } from "antd";
import { Pencil, Plus } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback } from "react";
import FlagSelector from "@/components/FlagSelector";
import LoadingMask from "@/components/LoadingMask";
import { NodeAPI } from "../../api";
import styles from "./index.module.scss";

const FormItem = Form.Item;

const createrTitle = (
  <>
    <Plus className="anticon" size={15} strokeWidth={3} />
    <span>创建新节点</span>
  </>
);

const modifyTitle = (
  <>
    <Pencil className="anticon" size={13} strokeWidth={3} />
    <span>修改节点信息</span>
  </>
);
export interface Props {
  setItem: (item: _Node.INode | _App.IDirectory | undefined) => void;
  item?: _Node.INode | _App.IDirectory;
  currentPath: string;
}

const AppEdit: FC<Props> = ({ item, setItem, currentPath }) => {
  const queryClient = useQueryClient();

  const onCloseEdit = useCallback(() => {
    setItem(undefined);
  }, [setItem]);

  const nodeEdit = useMutation({
    mutationFn: NodeAPI.editItem,
    onSuccess: (result, args) => {
      setItem(undefined);
      const id = result.id;
      queryClient.invalidateQueries({ queryKey: [NodeAPI.listQueryKey] });
      queryClient.invalidateQueries({ queryKey: [NodeAPI.itemQueryKey, id] });
    },
  });

  return item ? (
    <Modal open title={item.id ? modifyTitle : createrTitle} onCancel={onCloseEdit} maskClosable={false} footer={null}>
      <div className={styles.NodeEdit}>
        <LoadingMask show={nodeEdit.isPending} />
        <Form layout="vertical" initialValues={item} onFinish={nodeEdit.mutate}>
          <FormItem hidden name="id" />
          <FormItem label="父级目录" required>
            <Input variant="filled" value={currentPath || "/"} readOnly />
          </FormItem>
          <FormItem label="名称&图标" name="name" rules={[{ required: true }]} style={{ width: "418px" }}>
            <Input variant="filled" placeholder="请输入节点名称" />
          </FormItem>
          <FormItem name="logo" style={{ position: "absolute", top: "104px", right: "0px" }}>
            <FlagSelector />
          </FormItem>
          <FormItem label="节点描述" name="desc" rules={[{ required: true }]}>
            <Input.TextArea variant="filled" rows={5} placeholder="请输入项目描述" showCount maxLength={100} />
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

export default memo(AppEdit);
