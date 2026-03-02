import { Button, Checkbox, Form, Input } from "antd";
import { KeyRound, UserRound } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import styles from "./index.module.scss";

const FormItem = Form.Item;

const LoginForm: FC<{ auth: _App.AuthUser; onSubmit: (data: _App.AuthLogin) => void }> = ({ auth, onSubmit }) => {
  if (auth.id) {
    return null;
  }
  return (
    <div className={styles.LoginForm}>
      <span role="img" className={`${styles.LoginForm}__svg anticon-share-alt`}>
        <svg viewBox="64 64 896 896" focusable="false" data-icon="share-alt" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M752 664c-28.5 0-54.8 10-75.4 26.7L469.4 540.8a160.68 160.68 0 000-57.6l207.2-149.9C697.2 350 723.5 360 752 360c66.2 0 120-53.8 120-120s-53.8-120-120-120-120 53.8-120 120c0 11.6 1.6 22.7 4.7 33.3L439.9 415.8C410.7 377.1 364.3 352 312 352c-88.4 0-160 71.6-160 160s71.6 160 160 160c52.3 0 98.7-25.1 127.9-63.8l196.8 142.5c-3.1 10.6-4.7 21.8-4.7 33.3 0 66.2 53.8 120 120 120s120-53.8 120-120-53.8-120-120-120zm0-476c28.7 0 52 23.3 52 52s-23.3 52-52 52-52-23.3-52-52 23.3-52 52-52zM312 600c-48.5 0-88-39.5-88-88s39.5-88 88-88 88 39.5 88 88-39.5 88-88 88zm440 236c-28.7 0-52-23.3-52-52s23.3-52 52-52 52 23.3 52 52-23.3 52-52 52z"></path>
        </svg>
      </span>
      <div className={`${styles.LoginForm}__shadow panel`} />
      <div className={`${styles.LoginForm}__wrap panel`}>
        <div className={`${styles.LoginForm}__form`}>
          <h2 style={{ margin: "0 0 13px 3px" }}>嗨，近来可好！</h2>
          <div style={{ margin: "0 0 20px", color: "var(--bf-tx-summary)" }}>🌟 欢迎回来, 惊喜正在发生...</div>
          <Form className="g-form-compact" onFinish={onSubmit}>
            <FormItem name="username" rules={[{ required: true }]}>
              <Input variant="filled" allowClear prefix={<UserRound size={14} />} autoComplete="username" placeholder="请输入用户名" />
            </FormItem>
            <FormItem name="password">
              <Input.Password variant="filled" prefix={<KeyRound size={13} />} autoComplete="current-password" placeholder="请输入密码" />
            </FormItem>
            <FormItem>
              <div className={`${styles.LoginForm}__keep`}>
                <FormItem noStyle>
                  <Checkbox>记住登录</Checkbox>
                </FormItem>
                <Button type="link" size="small">
                  忘记密码？
                </Button>
              </div>
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" block>
                登录
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default memo(LoginForm);
