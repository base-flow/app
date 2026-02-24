import classnames from "classnames";
import { AlarmClockPlus, CirclePlay, LayoutList } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import styles from "./index.module.scss";

interface Props {
  value?: _Node.Kind;
  onChange?: (value: _Node.Kind) => void;
}

const Component: FC<Props> = ({ value, onChange }) => {
  return (
    <div className={`${styles.NodeEdit}__kind`}>
      <a className={classnames({ on: value === "executor" })} onClick={() => onChange?.("executor")}>
        <CirclePlay size={13} className="icon anticon" />
        执行器
      </a>
      <a className={classnames({ on: value === "trigger" })} onClick={() => onChange?.("trigger")}>
        <AlarmClockPlus size={13} className="icon anticon" />
        触发器
      </a>
      <a className={classnames({ on: value === "snippet" })} onClick={() => onChange?.("snippet")}>
        <LayoutList size={13} className="icon anticon" />
        组合片段
      </a>
    </div>
  );
};
export default memo(Component);
