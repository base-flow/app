import { Button } from "antd";
import classnames from "classnames";
import { SquarePen, Trash2 } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import Flag from "@/components/Flag";
import Star from "@/components/Star";
import styles from "./index.module.scss";

interface Props {
  data: FlowApp.IApp;
  setCurEdit: (data: FlowApp.IApp) => void;
  onDelete: (id: string, name: string) => void;
  onCollect: (id: string, collected: boolean) => void;
}

const Component: FC<Props> = ({ data, setCurEdit, onDelete, onCollect }) => {
  return (
    <div className={`${styles.AppListItem} g-card`}>
      <span
        className={classnames("g-star absolute", { on: data.collected })}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onCollect(data.id, !data.collected);
        }}
      >
        <Star />
      </span>
      <div className="head-icon">
        <Flag className="icon" src={data.logo} />
        <h4 className="title">{data.name}</h4>
        <div className="info">{data.updateDate}</div>
      </div>
      <div className="summary" title={data.desc}>
        {data.desc}
      </div>
      <div className="tools">
        <Button
          type="text"
          size="small"
          title="编辑"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setCurEdit(data);
          }}
        >
          <SquarePen size={14} />
        </Button>
        <Button
          type="text"
          size="small"
          title="删除"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete(data.id, data.name);
          }}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
};

export default memo(Component);
