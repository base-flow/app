import classnames from "classnames";
import { AppWindow, ScreenShare, Server, TextAlignJustify, TvMinimalPlay } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";

interface Props {
  type: _App.Runtime;
  className?: string;
  size?: number;
  onClick?: () => void;
}

const Component: FC<Props> = ({ type, className, size = 13, onClick }) => {
  return (
    <span className={classnames("g-icon", className)} onClick={onClick}>
      {type === "server" ? <Server size={size} /> : type === "browser" ? <TvMinimalPlay size={size} /> : <TextAlignJustify size={size} />}
    </span>
  );
};

export default memo(Component);
