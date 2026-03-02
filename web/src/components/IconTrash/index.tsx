import type { FC } from "react";
import { memo } from "react";

interface Props {
  className?: string;
  size?: number;
  onClick?: () => void;
}

const Component: FC<Props> = ({ className, onClick, size = 13 }) => {
  return (
    <svg viewBox="0 0 1024 1024" width={size} height={size} fill="currentColor" style={{ marginTop: "-1px" }} className={className} onClick={onClick}>
      <path d="M896 352l-73.792 556.608A96 96 0 0 1 727.04 992H296.96a96 96 0 0 1-95.168-83.392L128 352h768zM528 32A80 80 0 0 1 608 112V128h288a64 64 0 1 1 0 128H128a64 64 0 1 1 0-128h320v-16A80 80 0 0 1 528 32z"></path>
    </svg>
  );
};

export default memo(Component);
