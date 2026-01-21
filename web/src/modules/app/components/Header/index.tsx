import { getLocale } from "@baseflow/react";
import { StringSelect } from "@baseflow/widgets";
import { Link, useMatchRoute, useRouter } from "@tanstack/react-router";
import { Button, Dropdown } from "antd";
import { HatGlasses, LayoutGrid, ListPlus, LogOut, MousePointerClick, NotepadText, Settings2, UserRoundPen, Wifi } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import Avatar from "@/components/Avatar";
import Logo from "@/components/Logo";
import { LOCALE_KEY, MY_PERSONAL_ID } from "@/const";
import { useAppStore } from "@/modules/app/store";
import styles from "./index.module.scss";

const Header: FC = () => {
  const locale = getLocale();
  const router = useRouter();
  const [auth, logout] = useAppStore(useShallow(({ auth, logout }) => [auth, logout]));
  const matchRoute = useMatchRoute();
  // const isGraph = matchRoute({ to: "/flow/$flowId" });
  const isPersonal = matchRoute({ to: "/personal/$personalId", fuzzy: true });

  const userMenu: any = useMemo(() => {
    return {
      items: [
        {
          key: "user",
          label: (
            <Button block size="small" type="text">
              {`${auth.nickname} (${auth.username}) (${auth.roles})`}
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
            <Button block size="small" type="link" icon={<LogOut size={14} />}>
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

  return (
    <div className={styles.Header}>
      <Logo className={`${styles.Header}__logo`} />
      <div className="main">
        <nav className={`${styles.Header}__nav`}>
          <Link to="/personal/$personalId/workflow" params={{ personalId: MY_PERSONAL_ID }} className={isPersonal ? "on" : ""}>
            <UserRoundPen size={14} strokeWidth={2.5} />
            <span>个人空间</span>
          </Link>
          <Link
            to="/project"
            activeProps={{
              className: "on",
            }}
          >
            <LayoutGrid size={14} strokeWidth={2.5} />
            <span>项目空间</span>
          </Link>
          <Link
            to="/actuators"
            activeProps={{
              className: "on",
            }}
          >
            <Wifi size={14} strokeWidth={2.5} />
            <span>开放空间</span>
          </Link>
          {/* <Link
            to="/triggers"
            activeProps={{
              className: "on",
            }}
          >
            <MousePointerClick size={16} strokeWidth={2.5} />
            <span>触发器</span>
          </Link>
          <Link
            to="/trigger"
            activeProps={{
              className: "on",
            }}
          >
            <ListPlus size={16} strokeWidth={2.5} />
            <span>数据</span>
          </Link>
          <Link
            to="/templates"
            activeProps={{
              className: "on",
            }}
          >
            <NotepadText size={14} strokeWidth={2.5} />
            <span>模版</span>
          </Link> */}
          {/* <a href="https://www.baidu.com" target="_blank" rel="noreferrer noopener">
            <BulbFilled />
            <span>探索</span>
          </a> */}
        </nav>
      </div>
      <div className="side">
        <StringSelect
          className="locale"
          variant="borderless"
          value={locale}
          popupMatchSelectWidth={false}
          options={[
            { value: "en-US", label: "English" },
            { value: "zh-CN", label: "中文简体" },
          ]}
          onChange={(locale) => {
            localStorage.setItem(LOCALE_KEY, locale!);
            window.location.reload();
          }}
        />
        {auth.id ? (
          <Dropdown menu={userMenu}>
            <Avatar />
          </Dropdown>
        ) : null}
      </div>
    </div>
  );
};

export default memo(Header);
