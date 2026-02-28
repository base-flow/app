import { getLocale } from "@baseflow/react";
import { StringSelect } from "@baseflow/widgets";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { Button, Dropdown } from "antd";
import { LayoutGrid, LogOut, Share2, UserRoundPen, Wifi } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import Avatar from "@/components/Avatar";
import Logo from "@/components/Logo";
import { LOCALE_KEY } from "@/const";
import { useAppStore } from "@/modules/app/store";
import { useConfig } from "@/utils/hooks";
import styles from "./index.module.scss";

const ActiveProps = {
  className: "on",
};

const Header: FC = () => {
  const locale = getLocale();
  const { auth, logout } = useConfig();
  const [nickname] = useAppStore(useShallow(({ nickname }) => [nickname]));
  const matchRoute = useMatchRoute();
  const channel = (() => {
    if (matchRoute({ to: "/platform", fuzzy: true })) {
      return "Platform";
    } else if (matchRoute({ to: "/personal/$personalId", fuzzy: true })) {
      return "Personal";
    } else {
      return "";
    }
  })();

  const userMenu: any = useMemo(() => {
    return {
      items: [
        {
          key: "user",
          label: (
            <Button block size="small" type="text">
              {`${nickname} (${auth.username}) (${auth.role})`}
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
  }, [nickname, auth, logout]);

  return (
    <div className={styles.Header}>
      <Logo className={`${styles.Header}__logo`} />
      <div className="main">
        <nav className={`${styles.Header}__nav`}>
          <Link disabled={!auth.id} to="/personal/$personalId" params={{ personalId: auth.id }} className={channel === "Personal" ? "on" : undefined}>
            <UserRoundPen size={14} strokeWidth={2.5} />
            <span>个人空间</span>
          </Link>
          <Link disabled={!auth.id} to="/project" activeProps={ActiveProps}>
            <LayoutGrid size={14} strokeWidth={2.5} />
            <span>项目空间</span>
          </Link>
          <Link
            disabled={!auth.id}
            to="/platform/workflow/$runtime"
            params={{ runtime: "server" }}
            className={channel === "Platform" ? "on" : undefined}
          >
            <Wifi size={14} strokeWidth={2.5} />
            <span>公共空间</span>
          </Link>
          <Link disabled={!auth.id} to="/shared" activeProps={ActiveProps}>
            <Share2 size={14} strokeWidth={2.5} />
            <span>分享空间</span>
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
