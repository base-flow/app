import type { FC } from "react";
import { memo, useState } from "react";
import Flag from "@/components/Flag";
import IconEdit from "@/components/IconEdit";
import { useEvent, usePermissions, useProject } from "@/utils/hooks";
import ProjectEdit from "../ProjectEdit";

const Component: FC = () => {
  const { permissions } = usePermissions();
  const { project } = useProject();
  const [projectEdit, setProjectEdit] = useState<_Project.IProject>();

  const onEditProject = useEvent(() => {
    setProjectEdit(project);
  });

  return (
    <div className="g-head">
      <Flag className="icon" src={project.logo} />
      <span className="title">{project.name}</span>
      {permissions.project_edit && <IconEdit onClick={onEditProject} />}
      <div className="info">{project.desc}</div>
      <ProjectEdit item={projectEdit} setItem={setProjectEdit} />
    </div>
  );
};

export default memo(Component);
