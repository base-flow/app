import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import type { FC } from "react";
import { memo, useMemo } from "react";
import { useEvent } from "@/utils/hooks";
import { FlagSrc } from "../utils";
import "./index.scss";

init({ data });

interface Props {
  className?: string;
  src: string;
  onClick?: (src: string) => void;
  title?: string;
}

const Component: FC<Props> = ({ className, src, onClick, title }) => {
  const { icon, emoji, bgColor } = useMemo(() => FlagSrc.decode(src), [src]);
  const clickHandler = useEvent(() => onClick?.(src));
  return (
    <div
      title={title}
      className={`comp-Flag${className ? ` ${className}` : ""}`}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
      onClick={clickHandler}
    >
      {icon ? <img src={icon} alt="project" /> : <em-emoji shortcodes={emoji} size="1.6em"></em-emoji>}
    </div>
  );
};

export default memo(Component);
