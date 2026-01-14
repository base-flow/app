import { Spin } from "antd";
import classnames from "classnames";
import type { FC } from "react";
import { memo } from "react";
import "./index.scss";

interface Props {
  show: boolean;
  position?: "leftTop" | "center";
}

const Component: FC<Props> = ({ show, position }) => {
  return show ? (
    <div className={classnames("comp-LoadingMask", position)}>
      <Spin />
    </div>
  ) : null;
};

export default memo(Component);
