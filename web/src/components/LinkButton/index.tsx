import classnames from "classnames";
import type { FC, ReactNode } from "react";
import { memo } from "react";
import "./index.scss";

export interface LinkButtonProps {
  className?: string;
  size?: number;
  gap?: number;
  icon?: ReactNode;
  label?: string;
  onClick?: () => void;
}

const Component: FC<LinkButtonProps> = ({ className, size = 13, gap = 3, icon, label, onClick }) => {
  return (
    <div className={classnames("comp-LinkButton", className)} style={{ fontSize: size }} onClick={onClick}>
      {icon}
      <span style={{ marginLeft: gap }}>{label}</span>
    </div>
  );
};

export default memo(Component);
