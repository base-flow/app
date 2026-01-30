import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo, useState } from "react";
import IconEntity from "@/components/IconEntity";
import IconNetwork from "@/components/IconNetwork";
import IconShare from "@/components/IconShare";
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
    if (matchRoute({ to: "/project/$projectId/shared" })) {
      return [openedKey, "shared"];
    } else if (matchRoute({ to: "/project/$projectId" })) {
      return [openedKey, "home"];
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
      },
      {
        key: "public",
        label: (
          <>
            <IconNetwork size={13} />
            <span>项目共享</span>
            <ExternalLink size={10} strokeWidth={2.5} />
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
    ];
    return list;
  }, [project]);

  return <MenuNav items={menuItems} selectedKey={selectedKey} openedKey={openedKey} onOpen={setOpenedKey} onSelect={onSelect} />;
};

export default memo(Component);
