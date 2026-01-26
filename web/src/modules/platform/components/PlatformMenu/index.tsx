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
    if (matchRoute({ to: "/platform/workflow/server" })) {
      return ["workflow", "workflow/server"];
    } else if (matchRoute({ to: "/platform/workflow/browser" })) {
      return ["workflow", "workflow/browser"];
    } else if (matchRoute({ to: "/platform/node/server" })) {
      return ["node", "node/server"];
    } else if (matchRoute({ to: "/platform/node/browser" })) {
      return ["node", "node/browser"];
    } else if (matchRoute({ to: "/platform/workflow" })) {
      return ["workflow", "workflow"];
    } else if (matchRoute({ to: "/platform/node" })) {
      return ["node", "node"];
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
        navigate({ to: "/platform/workflow" });
        break;
      case "workflow/server":
        navigate({ to: "/platform/workflow/$runtime", params: { personalId: personal.username } });
        break;
      case "workflow/browser":
        // navigate({ to: "/personal/$personalId/node", params: { personalId: personal.username } });
        break;
      case "node":
        navigate({ to: "/platform/node" });
        break;
      case "node/server":
        // navigate({ to: "/personal/$personalId/workflow", params: { personalId: personal.username } });
        break;
      case "node/browser":
        // navigate({ to: "/personal/$personalId/node", params: { personalId: personal.username } });
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
