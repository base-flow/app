import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select } from "antd";
import { FilePenLine, Plus } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo, useState } from "react";
import LoadingMask from "@/components/LoadingMask";
import { FileNameRule, RequiredRule, RuntimeOptions } from "@/const";
import { NodeAPI } from "@/modules/node/api";
import { useEntityNavigate, useEvent } from "@/utils/hooks";
import { verifyFileName } from "@/utils/tools";
import { EntityAPI } from "../../api";
import styles from "./index.module.scss";
import KindTab from "./KindTab";

const FormItem = Form.Item;
const createrTitle = (
  <>
    <Plus className="anticon" size={15} strokeWidth={3} />
    <span>
      新建节点<small>(当前目录下)</small>
    </span>
  </>
);
const modifyTitle = (
  <>
    <FilePenLine className="anticon" size={14} strokeWidth={3} />
    <span>修改节点</span>
  </>
);

export type WorkflowEditProps = {
  item: Partial<_Node.INode>;
  onSuccess: () => void;
  onCancel: () => void;
};

const Component: FC<WorkflowEditProps> = ({ item, onCancel, onSuccess }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<"npm" | "name">();
  const { fileNavigate } = useEntityNavigate();
  const [npmInfo, setNpmInfo] = useState(!!item.npm);
  const [form] = Form.useForm<_Node.INode>();
  const kindValue = Form.useWatch("kind", form);

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

  const npmValidator = useEvent(async (_: any, value: string): Promise<void> => {
    setLoading("npm");
    setNpmInfo(false);
    return queryClient
      .fetchQuery(NodeAPI.queryNpmInfo(value))
      .then((res) => {
        form.setFieldsValue(res);
        setNpmInfo(true);
      })
      .finally(() => {
        setLoading(undefined);
      });
  });

  const npmRules = useMemo(() => [{ required: true }, { validator: npmValidator }], [npmValidator]);

  const onValuesChange = useEvent((values: Partial<_Node.INode>) => {
    if (values.kind) {
      setTimeout(() => {
        const isOrigin = values.kind === item.kind;
        const fileds = ["npm", "name", "icon", "runtime", "desc", "content"].map((key) => {
          const name = key as keyof _Node.INode;
          return {
            name,
            value: isOrigin ? item[name] : undefined,
            errors: [],
          };
        });
        form.setFields(fileds);
        setNpmInfo(isOrigin ? !!item.npm : false);
      });
    }
  });

  const onFinish = useEvent((values: _Node.INode): void => {
    const error = verifyFileName(values.name);
    if (error) {
      form.setFields([{ name: "name", errors: [error] }]);
    } else {
      if (values.name !== item.name) {
        setLoading("name");
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
            setLoading(undefined);
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

  return (
    <Modal open title={item.id ? modifyTitle : createrTitle} width={550} footer={null} closable={false} onCancel={onCancel}>
      <div className={styles.NodeEdit}>
        <LoadingMask show={loading === "npm"} />
        <Form layout="vertical" form={form} initialValues={item} onValuesChange={onValuesChange} onFinish={onFinish}>
          <FormItem hidden name="id" />
          <FormItem hidden name="parentId" />
          <FormItem hidden name="type" />
          <FormItem hidden name="spaceType" />
          <FormItem hidden name="spaceId" />
          <FormItem hidden name="icon" />
          <FormItem hidden name="content" />
          <FormItem name="kind" noStyle>
            <KindTab />
          </FormItem>
          {kindValue !== "snippet" && (
            <FormItem label="包地址" name="npm" validateFirst validateTrigger="onBlur" rules={npmRules}>
              <Input variant="filled" placeholder="请输入名称..." allowClear />
            </FormItem>
          )}
          {(kindValue === "snippet" || npmInfo) && (
            <>
              <FormItem label="名称" name="name" rules={FileNameRule}>
                <Input variant="filled" placeholder="请输入名称..." />
              </FormItem>
              <FormItem label="运行环境" name="runtime" rules={RequiredRule}>
                <Select variant="filled" placeholder="请输入运行环境..." options={RuntimeOptions} />
              </FormItem>
              <FormItem label="描述" name="desc" tooltip="可用于搜索">
                <Input.TextArea variant="filled" rows={4} placeholder="请输入描述..." showCount maxLength={100} />
              </FormItem>
              <FormItem label="主页" name="url" tooltip="开发者主页">
                <Input variant="filled" placeholder="https://" />
              </FormItem>
            </>
          )}
          <div className="g-form-footer">
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" htmlType="submit" loading={loading === "name" || entityUpdater.isPending || entityCreater.isPending}>
              提交
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default memo(Component);
