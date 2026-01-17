import { BaseWidgets } from "@baseflow/react";
import { Link } from "@tanstack/react-router";
import classnames from "classnames";
import { SquarePen, TextAlignJustify, Trash2, UserRound } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import Collect from "@/components/Collect";
import Flag from "@/components/Flag";
import { useEvent } from "@/utils/hooks";
import styles from "./index.module.scss";

interface Props {
  data: FlowApp.IApp;
  role: FlowApp.AppRole;
  setCurEdit: (data: FlowApp.IApp) => void;
  onDelete: (id: string, name: string) => void;
  onCollect: (id: string, collected: boolean) => void;
}

const Component: FC<Props> = ({ data, role, setCurEdit, onDelete, onCollect }) => {
  return (
    <Link className={`${styles.AppListItem} g-card`} to="/apps/$appId/flows" params={{ appId: data.id }}>
      <Collect absolute id={data.id} value={data.collected} onChange={onCollect} />
      <div className="head-icon">
        <Flag className="icon" src={data.logo} />
        <h4 className="title">{data.name}</h4>
        <div className="info">{data.updateDate}</div>
      </div>
      <div className="summary" title={data.desc}>
        {data.desc}
      </div>
      <div className="footer">
        <div className="flows">
          <TextAlignJustify size={11} strokeWidth={3} />
          <span>{data.totalFlows}</span>
        </div>
        {role && (
          <div className="member">
            <UserRound size={11} strokeWidth={2.5} />
            <span>{role}</span>
          </div>
        )}
      </div>
      {role && (
        <div className="tools">
          <div
            title="编辑"
            className="btn"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setCurEdit(data);
            }}
          >
            <SquarePen size={13} />
          </div>
          <div
            title="删除"
            className="btn"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete(data.id, data.name);
            }}
          >
            <Trash2 size={13} />
          </div>
        </div>
      )}
    </Link>
  );
};

export default memo(Component);
