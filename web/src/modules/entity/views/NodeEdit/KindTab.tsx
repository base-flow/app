import classnames from "classnames";
import type { FC } from "react";
import { memo } from "react";
import IconNodeKind from "@/components/IconNodeKind";
import styles from "./index.module.scss";

interface Props {
  value?: _Node.Kind;
  onChange?: (value: _Node.Kind) => void;
}

const Component: FC<Props> = ({ value, onChange }) => {
  return (
    <div className={`${styles.NodeEdit}__kind`}>
      <IconNodeKind kind="executor" showLabel className={classnames({ on: value === "executor" })} onClick={onChange} />
      <IconNodeKind kind="trigger" showLabel className={classnames({ on: value === "trigger" })} onClick={onChange} />
      <IconNodeKind kind="snippet" showLabel className={classnames({ on: value === "snippet" })} onClick={onChange} />
    </div>
  );
};
export default memo(Component);
