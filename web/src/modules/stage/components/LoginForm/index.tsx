import type { FC } from 'react';
import { LockOutlined, ShareAltOutlined, UserOutlined } from '@/components/Icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { memo } from 'react';
import styles from './index.module.scss';

const FormItem = Form.Item;

const LoginForm: FC<{ auth: Core.IAuthUser; onSubmit: (data: Core.AuthLogin) => void }> = ({ auth, onSubmit }) => {
  if (auth.id) {
    return null;
  }
  return (
    <div className={styles.LoginForm}>
      <ShareAltOutlined className={`${styles.LoginForm}__svg`} />
      <div className={`${styles.LoginForm}__shadow panel`} />
      <div className={`${styles.LoginForm}__wrap panel`}>
        <div className={`${styles.LoginForm}__form`}>
          <h2 style={{ margin: '0 0 13px 3px' }}>嗨，近来可好！</h2>
          <div style={{ margin: '0 0 20px', color: 'var(--bf-tx-summary)' }}>🌟 欢迎回来, 惊喜正在发生...</div>
          <Form className="g-form-compact" onFinish={onSubmit}>
            <FormItem name="username" rules={[{ required: true }]}>
              <Input variant="filled" allowClear prefix={<UserOutlined />} autoComplete="username" placeholder="请输入用户名" />
            </FormItem>
            <FormItem name="password">
              <Input.Password variant="filled" prefix={<LockOutlined />} autoComplete="current-password" placeholder="请输入密码" />
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
