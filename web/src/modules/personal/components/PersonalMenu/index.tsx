import type { LinkProps } from "@tanstack/react-router";
import { FileSpreadsheet, Settings2, TextAlignJustify } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useMemo, useState } from "react";
import LinkNav from "@/components/LinkNav";
import { usePersonal } from "@/utils/hooks";

const Component: FC<{ personalId: string }> = ({ personalId }) => {
  const { personal } = usePersonal();

  const flowItems = useMemo(() => {
    if (!personal) {
      return [];
    }
    const list: LinkProps[] = [
      {
        to: "/personal/$personalId/workflow",
        params: { personalId },
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
                (<em>{personal.totalWorkflows}</em>)
              </small>
            </span>
          </>
        ),
      },
      {
        to: "/personal/$personalId/node",
        params: { personalId },
        search: { runtime: undefined },
        children: (
          <>
            <Settings2 size={14} strokeWidth={2} />
            <span>
              节点管理
              <small>
                (<em>{personal.totalNodes}</em>)
              </small>
            </span>
          </>
        ),
      },
    ];
    return list;
  }, [personalId, personal]);

  return (
    <div className="g-nav">
      <LinkNav links={flowItems} />
    </div>
  );
};

export default memo(Component);
