import { AlarmClockPlus, CirclePlay, LayoutList } from "lucide-react";
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

  return (
    <span className={className} onClick={_onClick}>
      {kind === "executor" ? (
        <CirclePlay size={size} className="g-vertical" />
      ) : kind === "trigger" ? (
        <AlarmClockPlus size={size} className="g-vertical" />
      ) : (
        <LayoutList size={size} className="g-vertical" />
      )}
      {showLabel && <span style={{ marginLeft: "3px", fontSize: size }}>{Lang.nodeKind[kind]}</span>}
    </span>
  );
};

export default memo(Component);
