import { BaseWidgets } from "@baseflow/react";
import { Clock } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import styles from "./index.module.scss";

const Component: FC<{ info: _Shared.IShared }> = ({ info }) => {
  return (
    <div className={styles.SharedInfo}>
      <ul>
        <li
          className="copy"
          onClick={() => {
            BaseWidgets.clipboard.write(location.href).then(() => {
              BaseWidgets.message.success("已复制到剪贴版...");
            });
          }}
        >
          复制分享链接
        </li>
        <li>
          <Clock size={11} className="g-vertical" />
          <span>创建时间：</span>
          <em>2026-03-21 12:12</em>
        </li>
        <li>
          <Clock size={11} className="g-vertical" />
          <span>过期时间：</span>
          <em>2026-03-21 12:12</em>
        </li>
        <li>
          <Clock size={11} className="g-vertical" />
          <span>剩余时间：</span>
          <em className="expires">24小时15分45秒</em>
        </li>
      </ul>
    </div>
  );
};

export default memo(Component);
