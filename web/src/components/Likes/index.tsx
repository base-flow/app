import type { FC } from "react";
import { memo } from "react";
import "./index.scss";

export type LikesProps = {
  likesNum?: number;
};

const Component: FC<LikesProps> = ({ likesNum = 0 }) => {
  return (
    <div className="comp-Likes">
      <span className="btn anticon">
        <svg viewBox="64 64 896 896" focusable="false" data-icon="message" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M924.3 338.4a447.57 447.57 0 00-96.1-143.3 443.09 443.09 0 00-143-96.3A443.91 443.91 0 00512 64h-2c-60.5.3-119 12.3-174.1 35.9a444.08 444.08 0 00-141.7 96.5 445 445 0 00-95 142.8A449.89 449.89 0 0065 514.1c.3 69.4 16.9 138.3 47.9 199.9v152c0 25.4 20.6 46 45.9 46h151.8a447.72 447.72 0 00199.5 48h2.1c59.8 0 117.7-11.6 172.3-34.3A443.2 443.2 0 00827 830.5c41.2-40.9 73.6-88.7 96.3-142 23.5-55.2 35.5-113.9 35.8-174.5.2-60.9-11.6-120-34.8-175.6zM312.4 560c-26.4 0-47.9-21.5-47.9-48s21.5-48 47.9-48 47.9 21.5 47.9 48-21.4 48-47.9 48zm199.6 0c-26.4 0-47.9-21.5-47.9-48s21.5-48 47.9-48 47.9 21.5 47.9 48-21.5 48-47.9 48zm199.6 0c-26.4 0-47.9-21.5-47.9-48s21.5-48 47.9-48 47.9 21.5 47.9 48-21.5 48-47.9 48z"></path>
        </svg>
      </span>
      <span className="btn anticon">
        <svg viewBox="64 64 896 896" focusable="false" data-icon="like" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 00-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 00471 99.9c-52 0-98 35-111.8 85.1l-85.9 311h-.3v428h472.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-.2-12.6-2-25.1-5.6-37.1zM112 528v364c0 17.7 14.3 32 32 32h65V496h-65c-17.7 0-32 14.3-32 32z"></path>
        </svg>
      </span>
      <span className="num">{likesNum}</span>
    </div>
  );
};

export default memo(Component);
