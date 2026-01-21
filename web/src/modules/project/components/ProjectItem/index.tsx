import { Link } from "@tanstack/react-router";
import { SquarePen, TextAlignJustify, Trash2, UserRound } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import Flag from "@/components/Flag";
import styles from "./index.module.scss";

interface Props {
  item: _Project.IProject;
  getPermissionsInProject: (projectId: string) => _Permission.IPermissions;
  setCurEdit: (item: _Project.IProject) => void;
  onDelete: (id: string, name: string) => void;
  projectRole?: _Permission.ProjectRole;
}

const Component: FC<Props> = ({ item, getPermissionsInProject, setCurEdit, onDelete, projectRole }) => {
  const permissions = getPermissionsInProject(item.id);
  return (
    <Link className={`${styles.ProjectItem} g-card`} to="/project/$projectId/workflow" params={{ projectId: item.id }}>
      <div className="head-icon">
        <Flag className="icon" src={item.logo} />
        <h4 className="title">{item.name}</h4>
        <div className="info">{item.updateDate}</div>
      </div>
      <div className="summary" title={item.desc}>
        {item.desc}
      </div>
      <div className="footer">
        <div className="flows">
          <TextAlignJustify size={11} strokeWidth={3} />
          <span>{item.totalItems}</span>
        </div>
        {projectRole && (
          <div className="member">
            <UserRound size={11} strokeWidth={2.5} />
            <span>{projectRole}</span>
          </div>
        )}
      </div>
      {(permissions.project_edit || permissions.project_delete) && (
        <div className="tools">
          {permissions.project_edit && (
            <div
              title="编辑"
              className="btn"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setCurEdit(item);
              }}
            >
              <SquarePen size={13} />
            </div>
          )}
          {permissions.project_delete && (
            <div
              title="删除"
              className="btn"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete(item.id, item.name);
              }}
            >
              <Trash2 size={13} />
            </div>
          )}
        </div>
      )}
    </Link>
  );
};

export default memo(Component);
