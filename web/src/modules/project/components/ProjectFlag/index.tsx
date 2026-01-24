import type { FC } from "react";
import { memo } from "react";
import Flag from "@/components/Flag";
import { useProject } from "@/utils/hooks";

const Component: FC = () => {
  const { project } = useProject();

  return (
    <div className="g-flag">
      <Flag className="icon" src={project.logo} title={project.name} />
      <div className="title" title={project.name}>
        {project.name}
      </div>
      <div className="info">2026-10-23</div>
    </div>
  );
};

export default memo(Component);
