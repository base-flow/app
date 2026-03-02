import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button, Checkbox, Form, Input, Modal, Radio, Space } from "antd";
import { KeyRound, Pen, Plus } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import LoadingMask from "@/components/LoadingMask";
import { FileNameRule, RequiredRule } from "@/const";
import { useEvent } from "@/utils/hooks";
import { generateRandomString } from "@/utils/tools";
import { SharedAPI } from "../../api";
import styles from "./index.module.scss";

const FormItem = Form.Item;
const FormLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

const createrTitle = (
  <>
    <Plus className="g-vertical" size={15} strokeWidth={3} />
    <span>创建分享</span>
  </>
);

const modifyTitle = (
  <>
    <Pen className="g-vertical" size={13} strokeWidth={3} />
    <span>修改分享</span>
  </>
);

export interface Props {
  item: Partial<_Shared.IShared>;
  onSuccess: () => void;
  onCancel: () => void;
}

const Component: FC<Props> = ({ item, onCancel, onSuccess }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const isCreate = !item.id;

  const sharedEdit = useMutation({
    mutationFn: SharedAPI.editItem,
    onSuccess: (result) => {
      BaseWidgets.message.success("操作成功！");
      if (isCreate) {
        navigate({ to: "/shared/$sharedId", params: { sharedId: result.id } });
        queryClient.invalidateQueries({ queryKey: [SharedAPI.listQueryKey] });
      } else {
        queryClient.invalidateQueries({ queryKey: [SharedAPI.listQueryKey] });
        queryClient.invalidateQueries({ queryKey: [SharedAPI.itemQueryKey, item.id] });
        queryClient.invalidateQueries({ queryKey: [SharedAPI.contentListQueryKey, item.id] });
      }
      onSuccess();
    },
  });

  const randomlyPassword = useEvent(() => {
    const password = generateRandomString(6);
    form.setFieldValue("password", password);
  });

  return (
    <Modal open={true} width={490} title={item.id ? modifyTitle : createrTitle} onCancel={onCancel} footer={null}>
      <div className={styles.SharedEdit}>
        <LoadingMask show={sharedEdit.isPending} />
        <Form {...FormLayout} form={form} initialValues={item} onFinish={sharedEdit.mutate}>
          <FormItem hidden name="id" />
          <FormItem hidden name="ids" />
          <FormItem hidden name="spaceType" />
          <FormItem hidden name="spaceId" />
          <FormItem label="主题" name="name" rules={FileNameRule}>
            <Input placeholder="请输入一个主题..." maxLength={64} allowClear />
          </FormItem>
          <FormItem label="有效期" name="expiration" rules={RequiredRule}>
            <Radio.Group
              block
              optionType="button"
              options={[
                { value: "day", label: "1天" },
                { value: "week", label: "1周" },
                { value: "month", label: "1月" },
                { value: "year", label: "1年" },
                { value: "always", label: "永久" },
              ]}
            />
          </FormItem>
          <FormItem label="提取码" required>
            <Space size="small">
              <Form.Item name="password" noStyle rules={[{ required: true }, { pattern: /^[\w]+$/, message: "仅支持字母和数字和_" }]}>
                <Input placeholder="仅支持字母和数字和_" maxLength={6} />
              </Form.Item>
              <Button type="link" size="small" icon={<KeyRound size={13} />} onClick={randomlyPassword}>
                随机生成
              </Button>
            </Space>
          </FormItem>
          <FormItem name="urlWithPassword" valuePropName="checked" label={null}>
            <Checkbox>分享链接自带提取码</Checkbox>
          </FormItem>
          <div className="g-form-footer">
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default memo(Component);
