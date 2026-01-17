import { BaseWidgets } from "@baseflow/react";
import { StringSelect } from "@baseflow/widgets";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Button, Form, Input, Modal } from "antd";
import { Info, UserRoundPlus } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useMemo } from "react";
import Lang from "@/assets/Lang";
import LoadingMask from "@/components/LoadingMask";
import { AppRoleOptions } from "@/const";
import { FlowAppAPI } from "../../api";
import styles from "./index.module.scss";

const FormItem = Form.Item;

const ModalTitle = (
  <>
    <UserRoundPlus className="anticon" size={15} strokeWidth={3} />
    <span>申请成员</span>
  </>
);

export interface Props {
  setItem: (item: FlowApp.IApplyMemberData | undefined) => void;
  item: FlowApp.IApplyMemberData | undefined;
  user: string;
}

const AppEdit: FC<Props> = ({ item, setItem, user }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const onCloseEdit = useCallback(() => {
    setItem(undefined);
  }, [setItem]);

  const memberApply = useMutation({
    mutationFn: FlowAppAPI.applyMember,
    onSuccess: (result, args) => {
      // setItem(undefined);
      // const id = result.id;
      // const isCreate = !args.id;
      // queryClient.invalidateQueries({ queryKey: [FlowAppAPI.listQueryKey] });
      // queryClient.invalidateQueries({ queryKey: [FlowAppAPI.itemQueryKey, id] });
      // if (isCreate) {
      //   router.navigate({ to: "/apps/$appId/flows", params: { appId: id } });
      // }
    },
  });

  return item ? (
    <Modal open title={ModalTitle} onCancel={onCloseEdit} footer={null}>
      <div className={styles.MemberApply}>
        <LoadingMask show={memberApply.isPending} />
        <Form layout="horizontal" initialValues={item} onFinish={memberApply.mutate}>
          <FormItem hidden name="appId">
            <Input />
          </FormItem>
          <div className="role-item">
            <span>{`用户【${user}】申请成为本应用的`}：</span>
            <Form.Item name="role" noStyle>
              <StringSelect size="small" variant="filled" style={{ width: 100 }} value={item.role} options={AppRoleOptions} />
            </Form.Item>
            <Info className="info anticon" size={13} onClick={() => BaseWidgets.message.info(Lang.appRolesTips)} />
          </div>
          <FormItem name="reason" rules={[{ required: true }]}>
            <Input.TextArea variant="filled" rows={3} placeholder="请输入申请理由" showCount maxLength={100} />
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
