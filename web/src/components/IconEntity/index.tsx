import classnames from "classnames";
import { Settings2, TextAlignJustify } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";

interface Props {
  type: _App.EntryType;
  className?: string;
  size?: number;
  onClick?: () => void;
}

const Component: FC<Props> = ({ type, className, size = 13, onClick }) => {
  return (
    <span className={classnames("g-icon", className)} onClick={onClick}>
      {type === "directory" ? (
        <svg viewBox="0 0 1024 1024" width={size} height={size} fill="currentColor">
          <path d="M20.48 356.352h983.04c0-69.632-53.248-122.88-122.88-122.88h-397.312L450.56 155.648C434.176 110.592 389.12 81.92 339.968 81.92H143.36c-69.632 0-122.88 53.248-122.88 122.88v151.552zM20.48 819.2c0 65.536 53.248 122.88 122.88 122.88h737.28c65.536 0 122.88-53.248 122.88-122.88v-380.928H20.48V819.2z"></path>

          {/* <path d="M1003.52 315.392c0-57.344-49.152-106.496-106.496-106.496h-397.312c-8.192 0-16.384-4.096-20.48-12.288l-36.864-65.536c-20.48-32.768-53.248-53.248-94.208-53.248H126.976C69.632 77.824 20.48 122.88 20.48 184.32v167.936h983.04v-36.864zM126.976 946.176h770.048c57.344 0 106.496-49.152 106.496-106.496v-409.6H20.48v409.6c0 61.44 49.152 106.496 106.496 106.496z"></path> */}
        </svg>
      ) : type === "node" ? (
        <Settings2 size={size} />
      ) : (
        <TextAlignJustify size={size} />
      )}
    </span>
  );
};

export default memo(Component);
