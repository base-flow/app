import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import classnames from "classnames";
import type { FC, ReactNode } from "react";
import { memo } from "react";
import { arrayInsertSeparator } from "@/utils/tools";
import "./index.scss";

export interface LinkItem extends LinkProps {
  key: string;
  children: ReactNode;
  className?: string;
}

export interface LinkTabProps {
  className?: string;
  links: LinkItem[];
  onClick?: (item: LinkItem) => void;
}

const Component: FC<LinkTabProps> = ({ className, links, onClick }) => {
  return (
    <div className={classnames("comp-LinkTab", className)}>
      {arrayInsertSeparator(links, null).map((item: LinkItem, index) =>
        !item ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: <>
          <span key={index} />
        ) : item.to ? (
          <Link key={item.key} to={item.to} search={item.search} className={item.className}>
            {item.children}
          </Link>
        ) : (
          <a key={item.key} className={item.className} onClick={() => onClick?.(item)}>
            {item.children}
          </a>
        ),
      )}
    </div>
  );
};

export default memo(Component);
