import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import classnames from "classnames";
import type { FC } from "react";
import { memo } from "react";
import "./index.scss";

const activeClassName = {
  className: "on",
};

export interface LinkNavProps {
  className?: string;
  links: LinkProps[];
  size?: "small";
}

const LinkNav: FC<LinkNavProps> = ({ className, size, links }) => {
  return (
    <div className={classnames("comp-LinkNav", className, size)}>
      {links.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <>
        <Link key={index} activeProps={activeClassName} {...item}>
          {item.children}
        </Link>
      ))}
    </div>
  );
};

export default memo(LinkNav);
