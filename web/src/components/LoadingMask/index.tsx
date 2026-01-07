import { Spin } from "antd";
import type { FC } from "react";
import { memo } from "react";
import "./index.scss";

interface Props {
  show: boolean;
}

const Component: FC<Props> = ({ show }) => {
  return show ? (
    <div className="comp-LoadingMask">
      <Spin />
    </div>
  ) : null;
};

export default memo(Component);
