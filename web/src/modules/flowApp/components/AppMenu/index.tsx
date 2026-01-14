import { useQuery } from "@tanstack/react-query";
import type { LinkProps } from "@tanstack/react-router";
import { Modal } from "antd";
import { Chromium, Server, TextAlignJustify, UserRoundPlus } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useMemo, useState } from "react";
import ErrorPanel from "@/components/ErrorPanel";
import LinkNav from "@/components/LinkNav";
import LoadingMask from "@/components/LoadingMask";
import { useEvent } from "@/utils/hooks";
import { FlowAppAPI } from "../../api";
import AppUsers from "../AppUsers";
import styles from "./index.module.scss";

const UsersTitle = (
  <>
    <UserRoundPlus size={15} strokeWidth={2.5} className="anticon" style={{ marginLeft: "4px" }} />
    <span>分配用户与角色</span>
  </>
);

const FlowMenu: FC<{ appId: string }> = ({ appId }) => {
  const app = useQuery(FlowAppAPI.queryItem(appId));
  const appData = app.data;
  const [showAppUsers, setShowAppUsers] = useState(false);
  const hideAppUsers = useCallback(() => setShowAppUsers(false), []);

  const flowItems = useMemo(() => {
    if (!appData) {
      return [];
    }
    const list: LinkProps[] = [
      {
        to: "/apps/$appId/flows",
        params: { appId },
        search: { runtime: undefined },
        activeOptions: {
          exact: true,
        },
        children: (
          <>
            <TextAlignJustify size={13} style={{ marginTop: 1 }} />
            <span>
              全部流程<small>({appData.totalFlows})</small>
            </span>
          </>
        ),
      },
      {
        to: "/apps/$appId/flows",
        params: { appId },
        search: { runtime: "server" },
        children: (
          <>
            <Server size={13} style={{ marginTop: 1 }} />
            <span>
              服务器运行<small>({appData.flowsNumber.server})</small>
            </span>
          </>
        ),
      },
      {
        to: "/apps/$appId/flows",
        params: { appId },
        search: { runtime: "browser" },
        children: (
          <>
            <Chromium size={14} />
            <span>
              浏览器运行<small>({appData.flowsNumber.browser})</small>
            </span>
          </>
        ),
      },
    ];
    return list;
  }, [appId, appData]);

  const configItems = useMemo(() => {
    const list: LinkProps[] = [
      {
        href: "users",
        children: (
          <>
            <UserRoundPlus size={13} />
            <span>用户与角色</span>
          </>
        ),
      },
    ];
    return list;
  }, []);

  const onConfigItemClick = useEvent((item: LinkProps) => {
    if (item.href === "users") {
      setShowAppUsers(true);
    }
  });

  if (app.isError) {
    return (
      <div className={`${styles.AppMenu} g-nav`}>
        <ErrorPanel message={app.error?.message || "错误"} />
      </div>
    );
  }

  if (!appData) {
    return (
      <div className={`${styles.AppMenu} g-nav`}>
        <LoadingMask show />
      </div>
    );
  }

  return (
    <div className={`${styles.AppMenu} g-nav`}>
      <div>
        <LinkNav links={flowItems} />
      </div>
      <div className="config">
        <div className="title">
          <span>管理</span>
        </div>
        <LinkNav links={configItems} size="small" onClick={onConfigItemClick} />
      </div>
      <Modal open={showAppUsers} title={UsersTitle} width={900} onCancel={hideAppUsers} footer={null}>
        <AppUsers appId={appId} />
      </Modal>
    </div>
  );
};

export default memo(FlowMenu);
