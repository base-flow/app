import { Spin } from "antd";
import classnames from "classnames";
import type { FC } from "react";
import { memo } from "react";
import "./index.scss";

interface Props {
  show: boolean;
  position?: "leftTop" | "center";
  size?: "small" | "default";
}

const Component: FC<Props> = ({ show, position, size }) => {
  return show ? (
    <div className={classnames("comp-LoadingMask", position)}>
      <Spin size={size} />
    </div>
  ) : null;
};

export default memo(Component);
