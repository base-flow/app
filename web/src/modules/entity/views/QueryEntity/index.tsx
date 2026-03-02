import type { FC } from "react";
import { memo } from "react";
import IconEntity from "@/components/IconEntity";
import styles from "./index.module.scss";

export interface QueryScopeProps {
  size?: number;
  value?: _App.EntityType;
  onChange: (value?: _App.EntityType) => void;
}

const Component: FC<QueryScopeProps> = ({ size, value, onChange }) => {
  return (
    <div className={styles.QueryEntity}>
      <IconEntity size={size} className="item" selected={value} showLabel onClick={onChange} />
      <span className="split" />
      <IconEntity size={size} className="item" selected={value} showLabel type="workflow" onClick={onChange} />
      <span className="split" />
      <IconEntity size={size} className="item" selected={value} showLabel type="node" onClick={onChange} />
      <span className="split" />
      <IconEntity size={size} className="item" selected={value} showLabel type="data" onClick={onChange} />
    </div>
  );
};

export default memo(Component);
