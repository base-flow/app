import type { LinkProps } from "@tanstack/react-router";
import { Modal } from "antd";
import { Star } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useMemo, useState } from "react";
import LinkNav from "@/components/LinkNav";
import { useEvent, usePermissions, useProject } from "@/utils/hooks";

const Component: FC = () => {
  const { auth, permissions } = usePermissions();
  const { project } = useProject();
  const [showMembers, setShowMembers] = useState(false);
  const hideMembers = useCallback(() => setShowMembers(false), []);

  const settingsItems = useMemo(() => {
    const list: LinkProps[] = [];
    if (permissions.project_assignUsers) {
      list.push({
        href: "members",
        children: (
          <>
            <Star size={13} />
            <span>我的收藏</span>
          </>
        ),
      });
    }
    return list;
  }, [permissions]);

  const onConfigItemClick = useEvent((item: LinkProps) => {
    if (item.href === "members") {
      setShowMembers(true);
    }
  });

  return (
    permissions.project_assignUsers && (
      <div className="g-settings">
        <div className="title">
          <span>管理</span>
        </div>
        <LinkNav links={settingsItems} size="small" onClick={onConfigItemClick} />
      </div>
    )
  );
};

export default memo(Component);
