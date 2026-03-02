import { AlarmClockPlus, CirclePlay, NotebookText, TextAlignJustify } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import Lang from "@/assets/Lang";
import { useEvent } from "@/utils/hooks";

interface Props {
  kind: _Node.Kind;
  className?: string;
  size?: number;
  showLabel?: boolean;
  onClick?: (kind: _Node.Kind) => void;
}

const Component: FC<Props> = ({ kind, className, size = 13, showLabel, onClick }) => {
  const _onClick = useEvent(() => onClick?.(kind));

  if (showLabel) {
    return (
      <span className={className} onClick={_onClick} style={{ fontSize: size }}>
        {kind === "executor" ? (
          <CirclePlay size={size} className="g-vertical" />
        ) : kind === "trigger" ? (
          <AlarmClockPlus size={size} className="g-vertical" />
        ) : kind === "snippet" ? (
          <NotebookText size={size} className="g-vertical" />
        ) : (
          <TextAlignJustify size={size} className="g-vertical" />
        )}
        <span style={{ marginLeft: "3px" }}>{kind ? Lang.nodeKind[kind] : Lang.all}</span>
      </span>
    );
  } else {
    if (kind === "executor") {
      return <CirclePlay size={size} className={className} onClick={_onClick} />;
    } else if (kind === "trigger") {
      return <AlarmClockPlus size={size} className={className} onClick={_onClick} />;
    } else if (kind === "snippet") {
      return <NotebookText size={size} className={className} onClick={_onClick} />;
    } else {
      return <TextAlignJustify size={size} className={className} onClick={_onClick} />;
    }
  }
};

export default memo(Component);
