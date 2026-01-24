import { Avatar } from "antd";
import type { FC } from "react";
import { memo, useState } from "react";
import { useEvent, usePermissions, usePersonal } from "@/utils/hooks";

const Component: FC = () => {
  const { personal } = usePersonal();

  return (
    <div className="g-flag">
      <Avatar className="icon" size={45} />
      <div className="title">{`${personal.nickname} (${personal.username})`}</div>
      <div className="info">xxx</div>
    </div>
  );
};

export default memo(Component);
