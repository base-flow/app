import { useEvent } from "@baseflow/react";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import type { FC } from "react";
import { memo, useMemo } from "react";
import { FlagSrc } from "../utils";
import "./index.scss";

init({ data });

interface Props {
  className?: string;
  src: string;
  onClick?: (src: string) => void;
}

const Flag: FC<Props> = ({ className, src, onClick }) => {
  const { icon, emoji, bgColor } = useMemo(() => FlagSrc.decode(src), [src]);
  const clickHandler = useEvent(() => onClick?.(src));
  return (
    <div className={`comp-Flag${className ? ` ${className}` : ""}`} style={bgColor ? { backgroundColor: bgColor } : undefined} onClick={clickHandler}>
      {icon ? <img src={icon} alt="app" /> : <em-emoji shortcodes={emoji} size="1.6em"></em-emoji>}
    </div>
  );
};

export default memo(Flag);
