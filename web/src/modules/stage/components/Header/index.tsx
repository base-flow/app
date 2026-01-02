import { BuildFilled, BulbFilled, ContainerFilled, LogoutOutlined, RocketFilled, SignatureFilled, ThunderboltFilled } from "@ant-design/icons";
import { Link, useMatchRoute, useRouter } from "@tanstack/react-router";
import { Button, Dropdown } from "antd";
import type { FC } from "react";
import { memo, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import Avatar from "@/components/Avatar";
import Logo from "@/components/Logo";
import { useStageStore } from "@/modules/stage/store";
import styles from "./index.module.scss";

const Header: FC = () => {
  const router = useRouter();
  const [auth, logout] = useStageStore(useShallow(({ auth, logout }) => [auth, logout]));
  const matchRoute = useMatchRoute();
  const isGraph = matchRoute({ to: "/flow/$flowId" });

  const userMenu: any = useMemo(() => {
    return {
      items: [
        {
          key: "user",
          label: (
            <Button block size="small" type="text">
              {auth.username}
            </Button>
          ),
          type: "group",
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          label: (
            <Button block size="small" type="link" icon={<LogoutOutlined />}>
              退出登录
            </Button>
          ),
        },
      ],
      onClick: ({ key }: { key: string }) => {
        if (key === "logout") {
          logout();
        }
      },
    };
  }, [auth, logout]);

  // const params = matchRoute({
  //   to: '/dashboard',
  // });
  // console.log(pathname);

  if (isGraph) {
    return null;
  }
  return (
    <div className={styles.Header}>
      {/* <Logo className={`${styles.Header}__logo shadown`} /> */}
      <Logo className={`${styles.Header}__logo`} />
      <div className="main">
        <nav className={`${styles.Header}__nav`}>
          <Link
            to="/dashboard"
            activeProps={{
              className: "on",
            }}
          >
            <SignatureFilled />
            <span>工作台</span>
          </Link>
          <Link
            to="/apps"
            activeProps={{
              className: "on",
            }}
          >
            <RocketFilled />
            <span>应用</span>
          </Link>
          <Link
            to="/nodes"
            activeProps={{
              className: "on",
            }}
          >
            <ThunderboltFilled />
            <span>节点</span>
          </Link>
          <Link
            to="/trigger"
            activeProps={{
              className: "on",
            }}
          >
            <ThunderboltFilled />
            <span>触发器</span>
          </Link>
          <Link
            to="/trigger"
            activeProps={{
              className: "on",
            }}
          >
            <BuildFilled />
            <span>模型</span>
          </Link>
          <Link
            to="/templates"
            activeProps={{
              className: "on",
            }}
          >
            <ContainerFilled />
            <span>模版</span>
          </Link>
          <a href="https://www.baidu.com" target="_blank" rel="noreferrer noopener">
            <BulbFilled />
            <span>探索</span>
          </a>
        </nav>
      </div>
      <div className="side">
        {auth.id ? (
          <Dropdown menu={userMenu}>
            <Avatar />
          </Dropdown>
        ) : (
          <Avatar guest onClick={() => router.navigate({ to: "/login" })} />
        )}
      </div>
    </div>
  );
};

export default memo(Header);
