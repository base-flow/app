import classnames from "classnames";
import { Clock, Link2, Trash2, UserRound } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo } from "react";
import Flag from "@/components/Flag";
import { openShared } from "@/utils/tools";
import styles from "./index.module.scss";

interface GotSharedCardProps {
  item: _Shared.IGotShared;
  onDelete: (id: string, name: string) => void;
}

const Component: FC<GotSharedCardProps> = ({ item, onDelete }) => {
  const { spaceLogo, spaceType } = item;
  const avatar = useMemo(() => {
    if (spaceType === "personal") {
      return (
        <div className="icon avatar">
          {spaceLogo ? (
            <img alt="avatar" width="34" height="34" src={spaceLogo} />
          ) : (
            <svg viewBox="0 0 1024 1024" width="34" height="34">
              <path
                d="M1.008044 511.992669c0 182.921017 97.464786 351.948415 255.693793 443.408924a510.922139 510.922139 0 0 0 511.434132 0A512.109031 512.109031 0 0 0 1023.829762 511.992669c0-282.759588-228.953813-511.992669-511.410859-511.992669C229.961856 0 1.008044 229.233081 1.008044 511.992669z"
                fill="#daeafdff"
              ></path>
              <path
                d="M791.268729 685.302188v25.971991C791.268729 741.99374 765.436371 767.989004 734.949535 767.989004H289.050465C258.563629 767.989004 232.731271 741.99374 232.731271 711.274179v-25.971991c0-68.513928 79.801039-108.68208 152.550543-141.775425 2.327239 0 4.677751-2.350512 7.028263-4.724296 4.701024-2.350512 11.729287-2.350512 18.780822 0 30.486836 18.897184 63.370729 30.71956 100.909101 30.71956 37.538372 0 70.398992-11.822376 100.909101-30.71956 4.701024-4.724296 11.729287-4.724296 18.780822 0 2.327239 0 4.701024 2.373784 7.028263 4.724296C711.467689 576.620107 791.268729 619.162044 791.268729 685.302188M512 209.451546c78.102154 0 139.634364 67.489943 139.634364 151.270562S590.102154 511.992669 512 511.992669s-139.634364-67.489943-139.634364-151.270561S433.897846 209.451546 512 209.451546"
                fill="#FFFFFF"
                p-id="121941"
              ></path>
            </svg>
          )}
        </div>
      );
    } else {
      return (
        <div className="icon">
          <Flag size={34} src={spaceLogo} />
        </div>
      );
    }
  }, [spaceLogo, spaceType]);

  return (
    <div className={classnames(styles.GotSharedCard, "g-card")} onClick={() => openShared(item.sharedId)}>
      <div
        title="删除"
        className="remove"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onDelete(item.id, item.name);
        }}
      >
        <Trash2 size={13} />
      </div>
      <div className="head-icon">
        {avatar}
        <h4 className="title">{item.name}</h4>
        <div className="info">
          <Clock size="10" className="anticon" style={{ marginRight: "2px" }} />
          2026-03-23 22:12:34
        </div>
      </div>
      <div className="footer">
        <div className="user">
          <UserRound size={12} strokeWidth={2.5} className="anticon" style={{ marginRight: "2px" }} />
          {item.spaceName}
        </div>
        <div className="expires">24小时后过期</div>
      </div>
    </div>
  );
};

export default memo(Component);
