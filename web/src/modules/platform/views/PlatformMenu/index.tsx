import type { LinkProps } from "@tanstack/react-router";
import { Link, useLocation, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { FolderOpen, FolderOutput, Server, Settings2, Star, TextAlignJustify } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import IconEntity from "@/components/IconEntity";
import IconNetwork from "@/components/IconNetwork";
import IconRuntime from "@/components/IconRuntime";
import IconShare from "@/components/IconShare";
import IconStar from "@/components/IconStar";
import type { MenuItem } from "@/components/MenuNav";
import MenuNav from "@/components/MenuNav";
import { useConfig, useEvent, usePermissions } from "@/utils/hooks";

const Component: FC = () => {
  const { auth } = usePermissions();
  const { config } = useConfig();
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const [openedKey, setOpenedKey] = useState<string | undefined>();
  const [selectedKey, setSelectedKey] = useState<string | undefined>();

  const mathData = (() => {
    if (matchRoute({ to: "/platform/workflow/$runtime", params: { runtime: "server" } })) {
      return ["workflow", "workflow/server"];
    } else if (matchRoute({ to: "/platform/workflow/$runtime", params: { runtime: "browser" } })) {
      return ["workflow", "workflow/browser"];
    } else if (matchRoute({ to: "/platform/node/$runtime", params: { runtime: "server" } })) {
      return ["node", "node/server"];
    } else if (matchRoute({ to: "/platform/node/$runtime", params: { runtime: "browser" } })) {
      return ["node", "node/browser"];
    } else {
      return [];
    }
  })();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useMemo(() => {
    setOpenedKey(mathData[0]);
    setSelectedKey(mathData[1]);
  }, [mathData.join(",")]);

  const onSelect = useEvent((key: string) => {
    switch (key) {
      case "workflow":
      case "workflow/server":
        navigate({ to: "/platform/workflow/$runtime", params: { runtime: "server" } });
        break;
      case "workflow/browser":
        navigate({ to: "/platform/workflow/$runtime", params: { runtime: "browser" } });
        break;
      case "node":
      case "node/server":
        navigate({ to: "/platform/node/$runtime", params: { runtime: "server" } });
        break;
      case "node/browser":
        navigate({ to: "/platform/node/$runtime", params: { runtime: "browser" } });
        break;
    }
  });

  const menuItems = useMemo(() => {
    const list: MenuItem[] = [
      {
        key: "workflow",
        label: (
          <>
            <IconEntity type="workflow" />
            <span>流程列表</span>
          </>
        ),
        children: [
          {
            key: "workflow/server",
            label: (
              <>
                <IconRuntime type="server" />
                <span>
                  服务器运行
                  <small>
                    (<em>10</em>)
                  </small>
                </span>
              </>
            ),
          },
          {
            key: "workflow/browser",
            label: (
              <>
                <IconRuntime type="browser" />
                <span>
                  浏览器运行
                  <small>
                    (<em>20</em>)
                  </small>
                </span>
              </>
            ),
          },
        ],
      },
      {
        key: "node",
        label: (
          <>
            <IconEntity type="node" />
            <span>节点列表</span>
          </>
        ),
        children: [
          {
            key: "node/server",
            label: (
              <>
                <IconRuntime type="server" />
                <span>
                  服务器运行
                  <small>
                    (<em>10</em>)
                  </small>
                </span>
              </>
            ),
          },
          {
            key: "node/browser",
            label: (
              <>
                <IconRuntime type="browser" />
                <span>
                  浏览器运行
                  <small>
                    (<em>20</em>)
                  </small>
                </span>
              </>
            ),
          },
        ],
      },
    ];
    return list;
  }, []);

  return <MenuNav items={menuItems} selectedKey={selectedKey} openedKey={openedKey} onOpen={setOpenedKey} onSelect={onSelect} />;
};

export default memo(Component);
