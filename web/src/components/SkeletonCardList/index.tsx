import { Skeleton } from "antd";
import classnames from "classnames";
import type { FC } from "react";
import { memo } from "react";
import "./index.scss";

const Component: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={classnames("comp-SkeletonCardList", className)}>
      <Skeleton.Node active />
      <Skeleton.Node active />
      <Skeleton.Node active />
      <Skeleton.Node active />
      <Skeleton.Node active />
      <Skeleton.Node active />
      <Skeleton.Node active />
      <Skeleton.Node active />
      <Skeleton.Node active />
      <Skeleton.Node active />
    </div>
  );
};

export default memo(Component);
