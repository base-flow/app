import type { LinkProps } from "@tanstack/react-router";
import { Link, useLocation, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { FolderOpen, FolderOutput, Settings2, Star, TextAlignJustify, Trash2 } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import IconEntity from "@/components/IconEntity";
import IconNetwork from "@/components/IconNetwork";
import IconShare from "@/components/IconShare";
import IconStar from "@/components/IconStar";
import IconTrash from "@/components/IconTrash";
import type { MenuItem } from "@/components/MenuNav";
import MenuNav from "@/components/MenuNav";
import { useEvent, useProject } from "@/utils/hooks";

const Component: FC = () => {
  const { project } = useProject();
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const [openedKey, setOpenedKey] = useState<string | undefined>();
  const [selectedKey, setSelectedKey] = useState<string | undefined>();

  const mathData = (() => {
    if (matchRoute({ to: "/project/$projectId/workflow" })) {
      return ["home", "home/workflow"];
    } else if (matchRoute({ to: "/project/$projectId/node" })) {
      return ["home", "home/node"];
    } else if (matchRoute({ to: "/project/$projectId/shared" })) {
      return [openedKey, "home/shared"];
    } else if (matchRoute({ to: "/project/$projectId" })) {
      return ["home", "home"];
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
      case "home":
        navigate({ to: "/project/$projectId", params: { projectId: project.id } });
        break;
      case "home/workflow":
        navigate({ to: "/project/$projectId/workflow", params: { projectId: project.id } });
        break;
      case "home/node":
        navigate({ to: "/project/$projectId/node", params: { projectId: project.id } });
        break;
      case "home/shared":
        navigate({ to: "/project/$projectId/shared", params: { projectId: project.id } });
        break;
    }
  });

  const menuItems = useMemo(() => {
    if (!project) {
      return [];
    }
    const list: MenuItem[] = [
      {
        key: "home",
        label: (
          <>
            <IconEntity type="directory" />
            <span>项目文档</span>
          </>
        ),
        children: [
          {
            key: "home/workflow",
            label: (
              <>
                <IconEntity type="workflow" />
                <span>
                  流程
                  <small>
                    (<em>{project.totalWorkflows}</em>)
                  </small>
                </span>
              </>
            ),
          },
          {
            key: "home/node",
            label: (
              <>
                <IconEntity type="node" />
                <span>
                  节点
                  <small>
                    (<em>{project.totalWorkflows}</em>)
                  </small>
                </span>
              </>
            ),
          },
        ],
      },
      {
        key: "home/shared",
        label: (
          <>
            <IconNetwork size={13} />
            <span>项目共享</span>
          </>
        ),
      },
      {
        key: "share",
        label: (
          <>
            <IconShare size={13} />
            <span>项目分享</span>
          </>
        ),
      },
      {
        key: "trash",
        label: (
          <>
            <IconTrash size={13} />
            <span>回收站</span>
          </>
        ),
      },
    ];
    return list;
  }, [project]);

  return <MenuNav items={menuItems} selectedKey={selectedKey} openedKey={openedKey} onOpen={setOpenedKey} onSelect={onSelect} />;
};

export default memo(Component);
