import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo, useState } from "react";
import IconEntity from "@/components/IconEntity";
import IconNetwork from "@/components/IconNetwork";
import IconShare from "@/components/IconShare";
import IconStar from "@/components/IconStar";
import IconTrash from "@/components/IconTrash";
import type { MenuItem } from "@/components/MenuNav";
import MenuNav from "@/components/MenuNav";
import { useEvent, usePersonal } from "@/utils/hooks";

const Component: FC = () => {
  const { personal } = usePersonal();
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const [openedKey, setOpenedKey] = useState<string | undefined>();
  const [selectedKey, setSelectedKey] = useState<string | undefined>();

  const mathData = (() => {
    if (matchRoute({ to: "/personal/$personalId/shared" })) {
      return [openedKey, "shared"];
    } else if (matchRoute({ to: "/personal/$personalId/favorite" })) {
      return [openedKey, "favorite"];
    } else if (matchRoute({ to: "/personal/$personalId" })) {
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
        navigate({ to: "/personal/$personalId", params: { personalId: personal.id } });
        break;
      case "public":
        navigate({ to: "/personal/$personalId", params: { personalId: personal.id }, search: { dir: personal.publicDir } });
        break;
      case "shared":
        navigate({ to: "/personal/$personalId/shared", params: { personalId: personal.id } });
        break;
      case "favorite":
        navigate({ to: "/personal/$personalId/favorite", params: { personalId: personal.id } });
        break;
    }
  });

  const menuItems = useMemo(() => {
    if (!personal) {
      return [];
    }
    const list: MenuItem[] = [
      {
        key: "home",
        label: (
          <>
            <IconEntity type="directory" />
            <span>我的文档</span>
          </>
        ),
      },
      {
        key: "public",
        label: (
          <>
            <IconNetwork size={13} />
            <span>我的共享</span>
            <ExternalLink size={10} strokeWidth={2.5} />
          </>
        ),
      },
      {
        key: "shared",
        label: (
          <>
            <IconShare size={13} />
            <span>我的分享</span>
          </>
        ),
      },
      {
        key: "favorite",
        label: (
          <>
            <IconStar size={13} />
            <span>我的收藏</span>
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
  }, [personal]);

  return <MenuNav items={menuItems} selectedKey={selectedKey} openedKey={openedKey} onOpen={setOpenedKey} onSelect={onSelect} />;
};

export default memo(Component);
