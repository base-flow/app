import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal } from "antd";
import { FilePenLine, Plus } from "lucide-react";
import type { FC } from "react";
import { memo, useEffect, useRef, useState } from "react";
import { FileNameRule } from "@/const";
import { useEvent } from "@/utils/hooks";
import { verifyFileName } from "@/utils/tools";
import { EntityAPI } from "../../api";

//
// const fileNameValidator = useEvent(async (_: any, value: string): Promise<void> => {
//   const error = verifyFileName(value);
//   if (error) {
//     throw new Error(error);
//   }
//   const exists = await queryClient.fetchQuery(EntityAPI.queryCheckFileName(item.parentId!, value));
//   if (exists) {
//     throw new Error("当前目录下该名称已经存在！");
//   }
// });

// const fileNameRules = useMemo(() => [{ required: true }, { validator: fileNameValidator }], [fileNameValidator]);
const FormItem = Form.Item;
const createrTitle = (
  <>
    <Plus className="anticon" size={15} strokeWidth={3} />
    <span>
      新建目录<small>(当前目录下)</small>
    </span>
  </>
);
const modifyTitle = (
  <>
    <FilePenLine className="anticon" size={14} strokeWidth={3} />
    <span>修改目录</span>
  </>
);

export type DirectoryEditProps = {
  item: Partial<_App.IDirectory>;
  onSuccess: () => void;
  onCancel: () => void;
};

const Component: FC<DirectoryEditProps> = ({ item, onCancel, onSuccess }) => {
  const inputRef = useRef<HTMLElement>(null);
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const entityCreater = useMutation({
    mutationFn: EntityAPI.createItem,
    onSuccess: () => {
      BaseWidgets.message.success("创建成功！");
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey] });
      onSuccess();
    },
  });

  const entityUpdater = useMutation({
    mutationFn: EntityAPI.updateItem,
    onSuccess: () => {
      BaseWidgets.message.success("修改成功！");
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey] });
      onSuccess();
    },
  });

  const onFinish = useEvent((values: _App.IDirectory): void => {
    if (values.name === item.name && values.desc === item.desc) {
      onCancel();
      return;
    }
    const error = verifyFileName(values.name);
    if (error) {
      form.setFields([{ name: "name", errors: [error] }]);
    } else {
      if (values.name !== item.name) {
        setLoading(true);
        EntityAPI.checkFileName(values.parentId, values.name)
          .then((exists) => {
            if (exists) {
              form.setFields([{ name: "name", errors: ["当前目录下该名称已经存在！"] }]);
            } else {
              if (values.id) {
                entityUpdater.mutate(values);
              } else {
                entityCreater.mutate(values);
              }
            }
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        if (values.id) {
          entityUpdater.mutate(values);
        } else {
          entityCreater.mutate(values);
        }
      }
    }
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Modal open title={item.id ? modifyTitle : createrTitle} width={500} footer={null} onCancel={onCancel}>
      <div>
        <Form layout="vertical" form={form} initialValues={item} onFinish={onFinish}>
          <FormItem hidden name="id" />
          <FormItem hidden name="parentId" />
          <FormItem hidden name="type" />
          <FormItem hidden name="spaceType" />
          <FormItem hidden name="spaceId" />
          <FormItem label="名称" name="name" rules={FileNameRule}>
            <Input variant="filled" placeholder="请输入名称..." />
          </FormItem>
          <FormItem label="描述" tooltip="可用于搜索" name="desc">
            <Input.TextArea variant="filled" rows={4} placeholder="请输入描述..." showCount maxLength={100} />
          </FormItem>
          <div className="g-form-footer">
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" htmlType="submit" loading={loading || entityUpdater.isPending || entityCreater.isPending}>
              提交
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default memo(Component);
