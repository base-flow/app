import type { LinkProps } from "@tanstack/react-router";
import { Modal } from "antd";
import { Chromium, Server, TextAlignJustify, UserRoundPlus } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useMemo, useState } from "react";
import LinkNav from "@/components/LinkNav";
import { useEvent, useFlowAppData, usePermissions } from "@/utils/hooks";
import AppUsers from "../AppUsers";
import styles from "./index.module.scss";

const UsersTitle = (
  <>
    <UserRoundPlus size={15} strokeWidth={2.5} className="anticon" style={{ marginLeft: "4px" }} />
    <span>用户与权限</span>
  </>
);

const FlowMenu: FC = () => {
  const { auth, permissions } = usePermissions();
  const { appData } = useFlowAppData();
  const [showAppUsers, setShowAppUsers] = useState(false);
  const hideAppUsers = useCallback(() => setShowAppUsers(false), []);

  const appId = appData.id;

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
              全部流程
              <small>
                (<em>{appData.totalFlows}</em>)
              </small>
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
              服务器运行
              <small>
                (<em>{appData.flowsNumber.server}</em>)
              </small>
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
              浏览器运行
              <small>
                (<em>{appData.flowsNumber.browser}</em>)
              </small>
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
            <span>用户与权限</span>
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

  return (
    <div className={`${styles.AppMenu} g-nav`}>
      <div>
        <LinkNav links={flowItems} />
      </div>
      {permissions.app_assignUsers && (
        <div className="config">
          <div className="title">
            <span>管理</span>
          </div>
          <LinkNav links={configItems} size="small" onClick={onConfigItemClick} />
          <Modal open={showAppUsers} title={UsersTitle} width={900} onCancel={hideAppUsers} destroyOnHidden footer={null}>
            <AppUsers appId={appId} myId={auth.id} myRoleScope={permissions.app_assignUsers} />
          </Modal>
        </div>
      )}
    </div>
  );
};

export default memo(FlowMenu);
