import type { LinkProps } from "@tanstack/react-router";
import { Chromium, FolderGit, Server, Settings2 } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo } from "react";
import LinkNav from "@/components/LinkNav";
import { DomIds } from "@/const";
import { useEvent, usePermissions } from "@/utils/hooks";

interface NodeMenuProps {
  type: "actuator" | "trigger";
}

const NodeMenu: FC<NodeMenuProps> = ({ type }) => {
  const { permissions } = usePermissions();

  const nodeItems = useMemo(() => {
    const list: any[] = [];
    // const list: LinkProps[] =
    //   type === "actuator"
    //     ? [
    //         {
    //           to: "/actuators",
    //           search: { runtime: "server" },
    //           children: (
    //             <>
    //               <Server size={13} style={{ marginTop: 1 }} />
    //               <span>服务器运行</span>
    //             </>
    //           ),
    //         },
    //         {
    //           to: "/actuators",
    //           search: { runtime: "browser" },
    //           children: (
    //             <>
    //               <Chromium size={14} />
    //               <span>浏览器运行</span>
    //             </>
    //           ),
    //         },
    //       ]
    //     : [
    //         {
    //           to: "/triggers",
    //           search: { runtime: "server" },
    //           children: (
    //             <>
    //               <Server size={13} style={{ marginTop: 1 }} />
    //               <span>服务器运行</span>
    //             </>
    //           ),
    //         },
    //         {
    //           to: "/triggers",
    //           search: { runtime: "browser" },
    //           children: (
    //             <>
    //               <Chromium size={14} />
    //               <span>浏览器运行</span>
    //             </>
    //           ),
    //         },
    //       ];
    return list;
  }, [type]);

  const configItems = useMemo(() => {
    const list: LinkProps[] = [];
    if (permissions.node_create) {
      list.push({
        href: "createNode",
        children: (
          <>
            <Settings2 size={13} />
            <span>添加节点</span>
          </>
        ),
      });
      list.push({
        href: "createFolder",
        children: (
          <>
            <FolderGit size={13} />
            <span>添加文件夹</span>
          </>
        ),
      });
    }
    return list;
  }, [permissions]);

  const onConfigItemClick = useEvent((item: LinkProps) => {
    if (item.href === "createNode") {
      const btn = document.getElementById(DomIds.Button_CreateNode);
      btn?.click();
    } else if (item.href === "createFolder") {
      const btn = document.getElementById(DomIds.Button_CreateNodeFolder);
      btn?.click();
    }
  });

  return (
    <div className="g-nav">
      <div>
        <LinkNav links={nodeItems} />
      </div>
      {permissions.node_create && (
        <div className="config">
          <div className="title">
            <span>管理</span>
          </div>
          <LinkNav links={configItems} size="small" onClick={onConfigItemClick} />
        </div>
      )}
    </div>
  );
};

export default memo(NodeMenu);
