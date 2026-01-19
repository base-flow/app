import { Link } from "@tanstack/react-router";
import { SquarePen, TextAlignJustify, Trash2, UserRound } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import Collect from "@/components/Collect";
import Flag from "@/components/Flag";
import styles from "./index.module.scss";

interface Props {
  item: FlowApp.IApp;
  getPermissionsInApp: (appId: string) => App.IPermissions;
  setCurEdit: (item: FlowApp.IApp) => void;
  onDelete: (id: string, name: string) => void;
  onCollect: (id: string, collected: boolean) => void;
  appRole?: FlowApp.AppRole;
}

const Component: FC<Props> = ({ item, getPermissionsInApp, setCurEdit, onDelete, onCollect, appRole }) => {
  const permissions = getPermissionsInApp(item.id);
  return (
    <Link className={`${styles.AppListItem} g-card`} to="/apps/$appId/flows" params={{ appId: item.id }}>
      <Collect absolute id={item.id} value={item.collected} onChange={onCollect} />
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
          <span>{item.totalFlows}</span>
        </div>
        {appRole && (
          <div className="member">
            <UserRound size={11} strokeWidth={2.5} />
            <span>{appRole}</span>
          </div>
        )}
      </div>
      {(permissions.app_edit || permissions.app_delete) && (
        <div className="tools">
          {permissions.app_edit && (
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
          {permissions.app_delete && (
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
