import classnames from "classnames";
import { UserRoundCog } from "lucide-react";
import type { FC, MouseEvent } from "react";
import "./index.scss";

export interface AvatarProps {
  className?: string;
  src?: string;
  onClick?: (e: MouseEvent) => void;
  guest?: boolean;
}

const Avatar: FC<AvatarProps> = ({ className, guest, ...props }) => {
  return (
    <div className={classnames("comp-Avatar", className, { guest })} {...props}>
      <UserRoundCog size={16} />
    </div>
  );
};

export default Avatar;
