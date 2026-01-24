import classnames from "classnames";
import { ChevronRight } from "lucide-react";
import type { FC, ReactNode } from "react";
import { memo } from "react";
import "./index.scss";

export type MenuItem = {
  key: string;
  label: ReactNode;
  children?: { key: string; label: ReactNode }[];
};

export interface MenuNavProps {
  className?: string;
  items: MenuItem[];
  selectedKey?: string;
  openedKey?: string;
  onOpen?: (key?: string) => void;
  onSelect?: (key: string) => void;
}

const Component: FC<MenuNavProps> = ({ className, items, selectedKey, openedKey, onOpen, onSelect }) => {
  return (
    <div className={classnames("comp-MenuNav", className)}>
      {items.map((item) => (
        <div key={item.key} className={openedKey === item.key ? "opened" : undefined}>
          <a className={selectedKey === item.key ? "item on" : "item"} onClick={() => onSelect?.(item.key)}>
            {item.label}
            {item.children && (
              <ChevronRight
                className="expand"
                size={13}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen?.(openedKey === item.key ? undefined : item.key);
                }}
              />
            )}
          </a>
          {item.children && (
            <div className="children">
              {item.children.map((sub) => (
                <a key={sub.key} className={selectedKey === sub.key ? "item on" : "item"} onClick={() => onSelect?.(sub.key)}>
                  {sub.label}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default memo(Component);
