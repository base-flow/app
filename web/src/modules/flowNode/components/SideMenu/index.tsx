import type { LinkProps } from "@tanstack/react-router";
import { Chromium, Plus, Server, Settings } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo } from "react";
import LinkNav from "@/components/LinkNav";

interface SideMenuProps {
  type: "actuator" | "trigger";
}

const SideMenu: FC<SideMenuProps> = ({ type }) => {
  const nodeItems = useMemo(() => {
    const list: LinkProps[] =
      type === "actuator"
        ? [
            {
              to: "/actuators",
              search: { runtime: "server" },
              children: (
                <>
                  <Server size={13} style={{ marginTop: 1 }} />
                  <span>服务器运行</span>
                </>
              ),
            },
            {
              to: "/actuators",
              search: { runtime: "browser" },
              children: (
                <>
                  <Chromium size={14} />
                  <span>浏览器运行</span>
                </>
              ),
            },
          ]
        : [
            {
              to: "/triggers",
              search: { runtime: "server" },
              children: (
                <>
                  <Server size={13} style={{ marginTop: 1 }} />
                  <span>服务器运行</span>
                </>
              ),
            },
            {
              to: "/triggers",
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
  }, [type]);

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

export default memo(SideMenu);
