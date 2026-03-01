import { AppWindow, ScreenShare, Server, TextAlignJustify, TvMinimalPlay } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import Lang from "@/assets/Lang";

interface Props {
  runtime: _App.Runtime;
  className?: string;
  size?: number;
  showLabel?: boolean;
  onClick?: () => void;
}

const Component: FC<Props> = ({ runtime, className, size = 13, showLabel, onClick }) => {
  return (
    <span className={className} onClick={onClick}>
      {runtime === "server" ? (
        <Server size={size} className="g-vertical" />
      ) : runtime === "browser" ? (
        <TvMinimalPlay size={size} className="g-vertical" />
      ) : (
        <TextAlignJustify size={size} className="g-vertical" />
      )}
      {showLabel && <span style={{ marginLeft: "3px", fontSize: size }}>{Lang.runtime[runtime]}</span>}
    </span>
  );
};

export default memo(Component);
