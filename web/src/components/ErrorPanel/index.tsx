import { TriangleAlert } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import "./index.scss";

interface Props {
  message: string;
}

const Component: FC<Props> = ({ message }) => {
  return (
    <div className="comp-ErrorPanel">
      <TriangleAlert className="icon" size={14} />
      <span>{message}</span>
    </div>
  );
};
export default memo(Component);
