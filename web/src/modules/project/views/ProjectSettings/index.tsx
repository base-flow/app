import type { LinkProps } from "@tanstack/react-router";
import { Modal } from "antd";
import { UserRoundPlus } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useState } from "react";
import LinkNav from "@/components/LinkNav";
import { useEvent, useProject } from "@/utils/hooks";
import ProjectMembers from "../ProjectMembers";

const UsersTitle = (
  <>
    <UserRoundPlus size={15} strokeWidth={2.5} className="g-vertical" style={{ marginLeft: "4px" }} />
    <span>用户与权限</span>
  </>
);

const MenuItems: LinkProps[] = [
  {
    href: "members",
    children: (
      <>
        <UserRoundPlus size={13} className="g-vertical" />
        <span>用户与权限</span>
      </>
    ),
  },
];

const Component: FC = () => {
  const { project, projectRole } = useProject();
  const [showMembers, setShowMembers] = useState(false);
  const hideMembers = useCallback(() => setShowMembers(false), []);

  const onConfigItemClick = useEvent((item: LinkProps) => {
    if (item.href === "members") {
      setShowMembers(true);
    }
  });

  if (projectRole === "Owner" || projectRole === "Admin") {
    return (
      <div className="g-settings">
        <div className="title">
          <span>管理</span>
        </div>
        <LinkNav links={MenuItems} size="small" onClick={onConfigItemClick} />
        <Modal open={showMembers} title={UsersTitle} width={900} onCancel={hideMembers} destroyOnHidden footer={null}>
          <ProjectMembers projectId={project.id} />
        </Modal>
      </div>
    );
  }

  return null;
};

export default memo(Component);
