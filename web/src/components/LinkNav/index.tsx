import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import classnames from "classnames";
import type { FC, ReactNode } from "react";
import { memo } from "react";
import "./index.scss";

const activeClassName = {
  className: "on",
};

export interface LinkNavProps {
  className?: string;
  links: LinkProps[];
  size?: "small";
  onClick?: (item: LinkProps) => void;
}

const Component: FC<LinkNavProps> = ({ className, size, links, onClick }) => {
  return (
    <div className={classnames("comp-LinkNav", className, size)}>
      {links.map((item, index) =>
        item.to ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: <>
          <Link key={index} activeProps={activeClassName} {...item}>
            {item.children}
          </Link>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: <>
          <a key={index} onClick={() => onClick?.(item)}>
            {item.children as ReactNode}
          </a>
        ),
      )}
    </div>
  );
};

export default memo(Component);
