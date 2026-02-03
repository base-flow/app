import type { FC } from "react";
import { memo, useMemo } from "react";
import Flag from "@/components/Flag";
import "./index.scss";

const Component: FC<{ title: string; remark?: string; logo: string; type: "personal" | "project" }> = ({ title, remark, logo, type }) => {
  const avatar = useMemo(() => {
    if (type === "personal") {
      return (
        <div className="icon avatar">
          {logo ? (
            <img alt="avatar" src={logo} />
          ) : (
            <svg viewBox="0 0 1024 1024" width="45" height="45">
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
          <Flag size={45} src={logo} title={title} />
        </div>
      );
    }
  }, [logo, title, type]);

  return (
    <div className="comp-Nameplate">
      {avatar}
      <div className="title">
        {title}
        {remark && <small>{`(${remark})`}</small>}
      </div>
    </div>
  );
};

export default memo(Component);
