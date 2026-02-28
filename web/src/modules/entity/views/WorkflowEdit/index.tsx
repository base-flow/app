import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select } from "antd";
import { FilePenLine, Plus } from "lucide-react";
import type { FC } from "react";
import { memo, useEffect, useRef, useState } from "react";
import { FileNameRule, RequiredRule, RuntimeOptions } from "@/const";
import { useEntityNavigate, useEvent } from "@/utils/hooks";
import { verifyFileName } from "@/utils/tools";
import { EntityAPI } from "../../api";

const FormItem = Form.Item;
const createrTitle = (
  <>
    <Plus className="anticon" size={15} strokeWidth={3} />
    <span>
      新建流程<small>(当前目录下)</small>
    </span>
  </>
);
const modifyTitle = (
  <>
    <FilePenLine className="anticon" size={14} strokeWidth={3} />
    <span>修改流程</span>
  </>
);

export type WorkflowEditProps = {
  item: Partial<_Workflow.IWorkflow>;
  onSuccess: () => void;
  onCancel: () => void;
};

const Component: FC<WorkflowEditProps> = ({ item, onCancel, onSuccess }) => {
  const inputRef = useRef<HTMLElement>(null);
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { fileNavigate } = useEntityNavigate();

  const entityCreater = useMutation({
    mutationFn: EntityAPI.createItem,
    onSuccess: (res) => {
      BaseWidgets.message.success("创建成功！");
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey] });
      onSuccess();
      setTimeout(() => fileNavigate({ id: res.id, type: item.type! }));
    },
  });

  const entityUpdater = useMutation({
    mutationFn: EntityAPI.updateItem,
    onSuccess: () => {
      BaseWidgets.message.success("修改成功！");
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey] });
      queryClient.invalidateQueries({ queryKey: [EntityAPI.itemQueryKey] });
      onSuccess();
    },
  });

  const onFinish = useEvent((values: _Workflow.IWorkflow): void => {
    if (values.name === item.name && values.runtime === item.runtime && values.desc === item.desc) {
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
    <Modal open title={item.id ? modifyTitle : createrTitle} width={500} footer={null} closable={false} onCancel={onCancel}>
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
          <FormItem label="运行环境" name="runtime" rules={RequiredRule}>
            <Select variant="filled" placeholder="请输入运行环境..." options={RuntimeOptions} />
          </FormItem>
          <FormItem label="描述" tooltip="可用于搜索" name="desc">
            <Input.TextArea variant="filled" rows={2} placeholder="请输入描述..." showCount maxLength={100} />
          </FormItem>
          <FormItem label="Readme" tooltip="支持Markdown" name="readme">
            <Input.TextArea variant="filled" rows={5} placeholder="请输入描述..." showCount maxLength={100} />
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
