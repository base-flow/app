import { AppWindow, ScreenShare, Server, TextAlignJustify, TvMinimalPlay } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import Lang from "@/assets/Lang";
import { useEvent } from "@/utils/hooks";

interface Props {
  runtime: _App.Runtime;
  className?: string;
  size?: number;
  showLabel?: boolean;
  onClick?: (runtime: _App.Runtime) => void;
}

const Component: FC<Props> = ({ runtime, className, size = 13, showLabel, onClick }) => {
  const _onClick = useEvent(() => onClick?.(runtime));

  if (showLabel) {
    return (
      <span className={className} onClick={_onClick} style={{ fontSize: size }}>
        {runtime === "server" ? (
          <Server size={size} className="g-vertical" />
        ) : runtime === "browser" ? (
          <TvMinimalPlay size={size} className="g-vertical" />
        ) : (
          <TextAlignJustify size={size} className="g-vertical" />
        )}
        <span style={{ marginLeft: "3px" }}>{runtime ? Lang.runtime[runtime] : Lang.all}</span>
      </span>
    );
  } else {
    if (runtime === "server") {
      return <Server size={size} className={className} onClick={_onClick} />;
    } else if (runtime === "browser") {
      return <TvMinimalPlay size={size} className={className} onClick={_onClick} />;
    } else {
      return <TextAlignJustify size={size} className={className} onClick={_onClick} />;
    }
  }
};

export default memo(Component);
