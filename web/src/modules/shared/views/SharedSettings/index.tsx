import type { LinkProps } from "@tanstack/react-router";
import { Modal } from "antd";
import { Link2Off, Pencil, Settings } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useMemo, useState } from "react";
import LinkNav from "@/components/LinkNav";
import { useEvent } from "@/utils/hooks";

const Component: FC = () => {
  const settingsItems = useMemo(() => {
    const list: LinkProps[] = [];
    list.push(
      {
        href: "members",
        children: (
          <>
            <Settings size={13} />
            <span>修改分享设置</span>
          </>
        ),
      },
      {
        href: "members",
        children: (
          <>
            <Link2Off size={13} />
            <span>取消分享</span>
          </>
        ),
      },
    );
    return list;
  }, []);

  const onConfigItemClick = useEvent((item: LinkProps) => {
    if (item.href === "members") {
    }
  });

  return (
    <div className="g-settings">
      <div className="title">
        <span>管理</span>
      </div>
      <LinkNav links={settingsItems} size="small" onClick={onConfigItemClick} />
    </div>
  );
};

export default memo(Component);
