import type { LinkProps } from "@tanstack/react-router";
import { Modal } from "antd";
import { Settings2, TextAlignJustify } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useMemo, useState } from "react";
import LinkNav from "@/components/LinkNav";
import { useEvent, usePermissions, useProject } from "@/utils/hooks";

const Component: FC = () => {
  const { project } = useProject();

  const flowItems = useMemo(() => {
    if (!project) {
      return [];
    }
    const list: LinkProps[] = [
      {
        to: "/project/$projectId/workflow",
        params: { projectId: project.id },
        search: { runtime: undefined },
        activeOptions: {
          exact: true,
        },
        children: (
          <>
            <TextAlignJustify size={14} strokeWidth={2} />
            <span>
              流程管理
              <small>
                (<em>{project.totalWorkflows}</em>)
              </small>
            </span>
          </>
        ),
      },
      {
        to: "/project/$projectId/node",
        params: { projectId: project.id },
        search: { runtime: undefined },
        children: (
          <>
            <Settings2 size={14} strokeWidth={2} />
            <span>
              节点管理
              <small>
                (<em>{project.totalNodes}</em>)
              </small>
            </span>
          </>
        ),
      },
    ];
    return list;
  }, [project]);

  return <LinkNav links={flowItems} />;
};

export default memo(Component);
