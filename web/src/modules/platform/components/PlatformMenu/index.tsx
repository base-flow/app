import type { LinkProps } from "@tanstack/react-router";
import { FileSpreadsheet, Settings2, TextAlignJustify } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useMemo, useState } from "react";
import LinkNav from "@/components/LinkNav";
import { usePersonal } from "@/utils/hooks";

const Component: FC = () => {
  const flowItems = useMemo(() => {
    const list: LinkProps[] = [
      {
        to: "/platform/workflow",
        search: { runtime: undefined },
        // activeOptions: {
        //   exact: true,
        // },
        children: (
          <>
            <TextAlignJustify size={14} strokeWidth={2} />
            <span>
              流程管理
              <small>
                (<em>...</em>)
              </small>
            </span>
          </>
        ),
      },
      {
        to: "/platform/node",
        search: { runtime: undefined },
        children: (
          <>
            <Settings2 size={14} strokeWidth={2} />
            <span>
              节点管理
              <small>
                (<em>...</em>)
              </small>
            </span>
          </>
        ),
      },
    ];
    return list;
  }, []);

  return (
    <div className="g-nav">
      <LinkNav links={flowItems} />
    </div>
  );
};

export default memo(Component);
