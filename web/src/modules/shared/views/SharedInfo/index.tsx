import { Clock } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import styles from "./index.module.scss";

const Component: FC<{ info: _Shared.IShared }> = ({ info }) => {
  return (
    <div className={styles.SharedInfo}>
      <ul>
        <li>
          <Clock size={11} className="anticon" />
          <span>创建时间：</span>
          <em>2026-03-21 12:12</em>
        </li>
        <li>
          <Clock size={11} className="anticon" />
          <span>过期时间：</span>
          <em>2026-03-21 12:12</em>
        </li>
        <li>
          <Clock size={11} className="anticon" />
          <span>剩余：</span>
          <em>24小时15分45秒</em>
        </li>
      </ul>
    </div>
  );
};

export default memo(Component);
