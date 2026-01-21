import { Avatar } from "antd";
import type { FC } from "react";
import { memo, useState } from "react";
import { useEvent, usePermissions, usePersonal } from "@/utils/hooks";
import styles from "./index.module.scss";

const Component: FC = () => {
  const { personal } = usePersonal();

  return (
    <div className="g-head">
      <Avatar size={45} className="icon" />
      <span className="title">{`${personal.nickname} (${personal.username})`}</span>
      <div className="info">xxx</div>
    </div>
  );
};

export default memo(Component);
