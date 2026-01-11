import type { LinkProps } from "@tanstack/react-router";
import { Chromium, Plus, Server, Settings } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo } from "react";
import LinkNav from "@/components/LinkNav";

const NodeMenu: FC = () => {
  const nodeItems = useMemo(() => {
    const list: LinkProps[] = [
      {
        to: "/nodes",
        search: { runtime: "server" },
        children: (
          <>
            <Server size={13} style={{ marginTop: 1 }} />
            <span>服务器运行</span>
          </>
        ),
      },
      {
        to: "/nodes",
        search: { runtime: "browser" },
        children: (
          <>
            <Chromium size={14} />
            <span>浏览器运行</span>
          </>
        ),
      },
    ];
    return list;
  }, []);

  const configItems = useMemo(() => {
    const list: LinkProps[] = [
      {
        to: "/apps",
        children: (
          <>
            <Plus size={13} />
            <span>添加节点</span>
          </>
        ),
      },
    ];
    return list;
  }, []);

  return (
    <div className="g-nav">
      <div>
        <LinkNav links={nodeItems} />
      </div>
      <div className="config">
        <div className="title">
          <Settings size={12} />
          <span style={{ marginLeft: "5px" }}>管理</span>
        </div>
        <LinkNav links={configItems} size="small" />
      </div>
    </div>
  );
};

export default memo(NodeMenu);
