import { Divider } from "antd";
import classnames from "classnames";
import type { FC } from "react";
import { memo } from "react";

export interface VersionSelectProps {
  fetchNextPage: () => void;
  isFetching: boolean;
  hasNextPage: boolean;
}

const Component: FC<VersionSelectProps> = ({ fetchNextPage, isFetching, hasNextPage }) => {
  return (
    <Divider plain>
      <span className={classnames({ enable: !isFetching && hasNextPage })} onClick={() => fetchNextPage()}>
        {isFetching ? "加载中..." : hasNextPage ? "加载更多" : "没有更多了"}
      </span>
    </Divider>
  );
};

export default memo(Component);
