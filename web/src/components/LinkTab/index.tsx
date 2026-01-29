import { Link } from "@tanstack/react-router";
import classnames from "classnames";
import type { FC, ReactNode } from "react";
import { memo } from "react";
import { arrayInsertSeparator } from "@/utils/tools";
import "./index.scss";

export type LinkItem = {
  key: string;
  label: ReactNode;
  to?: string;
  search?: { [key: string]: any };
  className?: string;
};

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
            {item.label}
          </Link>
        ) : (
          <a key={item.key} className={item.className} onClick={() => onClick?.(item)}>
            {item.label}
          </a>
        ),
      )}
    </div>
  );
};

export default memo(Component);
