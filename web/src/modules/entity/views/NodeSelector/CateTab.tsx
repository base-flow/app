import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import classnames from "classnames";
import { ChevronDown, LayoutGrid, Share2, Star, UserRoundPen, Wifi } from "lucide-react";
import type { FC } from "react";
import { memo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/modules/app/store";
import { useEvent } from "@/utils/hooks";
import styles from "./index.module.scss";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

const Component: FC<Props> = ({ value, onChange }) => {
  const [myProjectRoles, auth] = useAppStore(useShallow(({ myProjectRoles, auth }) => [myProjectRoles, auth]));
  const [versionsMenu] = useState(() => ({
    items: [
      {
        key: "2",
        label: "创建新版本",
      },
      {
        key: "1",
        label: "发布正式版",
      },
      {
        key: "v1.0.1-dev",
        label: "v1.0.1-dev",
      },
      {
        key: "4",
        label: "v1.0.2-dev",
      },
      {
        key: "5",
        label: "v1.0.3",
      },
    ] as MenuProps["items"],
    selectedKeys: ["v1.0.1-dev"],
    offset: [0, 0],
  }));

  const _onClick = useEvent(() => {});

  return (
    <div className={`${styles.NodeSelector}__cate`}>
      <span className={classnames({ on: value === "我的文档" })} onClick={_onClick}>
        <UserRoundPen size={13} strokeWidth={2.5} className="g-vertical" />
        <span style={{ marginLeft: "3px" }}>我的文档</span>
      </span>
      <Dropdown menu={versionsMenu} placement="bottomCenter" align={versionsMenu}>
        <span className={classnames({ on: value === "我的文档" })} onClick={_onClick}>
          <LayoutGrid size={13} strokeWidth={2.5} className="g-vertical" />
          <span style={{ marginLeft: "3px" }}>我的项目</span>
          <ChevronDown size={13} strokeWidth={2.5} className="g-vertical" />
        </span>
      </Dropdown>
      <span className={classnames({ on: value === "executor" })} onClick={_onClick}>
        <Wifi size={13} strokeWidth={2.5} className="g-vertical" />
        <span style={{ marginLeft: "3px" }}>公共平台</span>
      </span>
      <span className={classnames({ on: value === "他人分享" })} onClick={_onClick}>
        <Share2 size={13} strokeWidth={2.5} className="g-vertical" />
        <span style={{ marginLeft: "3px" }}>他人分享</span>
      </span>
      <span className={classnames({ on: value === "我的收藏" })} onClick={_onClick}>
        <Star size={13} strokeWidth={2.5} className="g-vertical" />
        <span style={{ marginLeft: "3px" }}>我的收藏</span>
      </span>
    </div>
  );
};
export default memo(Component);
