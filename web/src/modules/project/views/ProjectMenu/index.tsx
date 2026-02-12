import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { memo, useMemo, useState } from "react";
import IconEntity from "@/components/IconEntity";
import IconNetwork from "@/components/IconNetwork";
import IconShare from "@/components/IconShare";
import IconTrash from "@/components/IconTrash";
import type { MenuItem } from "@/components/MenuNav";
import MenuNav from "@/components/MenuNav";
import { useEvent, useProject } from "@/utils/hooks";
import { isPublicDir } from "@/utils/tools";

const Component: FC<{ currentPath: string }> = ({ currentPath }) => {
  const { project, isMine } = useProject();
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const [openedKey, setOpenedKey] = useState<string | undefined>();
  const [selectedKey, setSelectedKey] = useState<string | undefined>();

  const mathData = (() => {
    if (matchRoute({ to: "/project/$projectId/shared" })) {
      return [openedKey, "shared"];
    } else if (matchRoute({ to: "/project/$projectId" })) {
      if (isPublicDir(currentPath)) {
        return [openedKey, "public"];
      } else {
        return [openedKey, "home"];
      }
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
      case "public":
        navigate({ to: "/project/$projectId", params: { projectId: project.id }, search: { dir: project.publicDir } });
        break;
      case "shared":
        navigate({ to: "/project/$projectId/shared", params: { projectId: project.id } });
        break;
    }
  });

  const menuItems = useMemo(() => {
    const list: MenuItem[] = isMine
      ? [
          {
            key: "home",
            label: (
              <>
                <IconEntity type="directory" />
                <span>
                  项目文档
                  <small>({project.totalItems})</small>
                </span>
              </>
            ),
          },
          {
            key: "public",
            label: (
              <>
                <IconNetwork size={13} />
                <span>
                  项目共享
                  <small>({project.totalPublics})</small>
                </span>
              </>
            ),
          },
          {
            key: "shared",
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
        ]
      : [
          {
            key: "public",
            label: (
              <>
                <IconNetwork size={13} />
                <span>
                  项目共享
                  <small>({project.totalPublics})</small>
                </span>
              </>
            ),
          },
        ];

    return list;
  }, [project, isMine]);

  return <MenuNav items={menuItems} selectedKey={selectedKey} openedKey={openedKey} onOpen={setOpenedKey} onSelect={onSelect} />;
};

export default memo(Component);
