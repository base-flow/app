import { Button } from "antd";
import classnames from "classnames";
import { ExternalLink, SquarePen, Trash2 } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import Likes from "@/components/Likes";
import Star from "@/components/Star";
import styles from "./index.module.scss";

const DefaultIcon =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ijg1Ljk1MiA3OC44NzIgMzQwLjk1NyAzNDAuOTU3IiB3aWR0aD0iMzQwLjk1N3B4IiBoZWlnaHQ9IjM0MC45NTdweCI+PGc+PHJlY3QgeD0iODUuOTUyIiB5PSI3OC44NzIiIHdpZHRoPSIzNDAuOTU3IiBoZWlnaHQ9IjM0MC45NTciIHN0eWxlPSJmaWxsOiMyYjdiZWE7IiAvPjxwYXRoIGQ9Ik0gMzI4LjAyNSAyOTUuOTYgQyAzMTkuMjg2IDI5NS45NiAzMTEuMjIxIDI5OS4wMjcgMzA0LjkwNSAzMDQuMTQ4IEwgMjQxLjM2NyAyNTguMTgzIEMgMjQyLjQzMiAyNTIuMzQgMjQyLjQzMiAyNDYuMzU1IDI0MS4zNjcgMjQwLjUyMSBMIDMwNC45MDUgMTk0LjU1NiBDIDMxMS4yMjEgMTk5LjY3NyAzMTkuMjg2IDIwMi43NDEgMzI4LjAyNSAyMDIuNzQxIEMgMzQ4LjMyNSAyMDIuNzQxIDM2NC44MjIgMTg2LjI0NiAzNjQuODIyIDE2NS45NDggQyAzNjQuODIyIDE0NS42NDIgMzQ4LjMyNSAxMjkuMTQ3IDMyOC4wMjUgMTI5LjE0NyBDIDMwNy43MjUgMTI5LjE0NyAyOTEuMjI4IDE0NS42NDIgMjkxLjIyOCAxNjUuOTQ4IEMgMjkxLjIyOCAxNjkuNTAyIDI5MS43MTkgMTcyLjkwNCAyOTIuNjY5IDE3Ni4xNTUgTCAyMzIuMzIyIDIxOS44NSBDIDIyMy4zNjcgMjA3Ljk4NiAyMDkuMTM5IDIwMC4yOTEgMTkzLjEwMiAyMDAuMjkxIEMgMTY1Ljk5NiAyMDAuMjkxIDE0NC4wNCAyMjIuMjQ2IDE0NC4wNCAyNDkuMzQ4IEMgMTQ0LjA0IDI3Ni40NTggMTY1Ljk5NiAyOTguNDEzIDE5My4xMDIgMjk4LjQxMyBDIDIwOS4xMzkgMjk4LjQxMyAyMjMuMzY3IDI5MC43MTcgMjMyLjMyMiAyNzguODQ5IEwgMjkyLjY2OSAzMjIuNTQ2IEMgMjkxLjcxOSAzMjUuNzk3IDI5MS4yMjggMzI5LjIzMSAyOTEuMjI4IDMzMi43NTcgQyAyOTEuMjI4IDM1My4wNTcgMzA3LjcyNSAzNjkuNTU1IDMyOC4wMjUgMzY5LjU1NSBDIDM0OC4zMjUgMzY5LjU1NSAzNjQuODIyIDM1My4wNTcgMzY0LjgyMiAzMzIuNzU3IEMgMzY0LjgyMiAzMTIuNDU3IDM0OC4zMjUgMjk1Ljk2IDMyOC4wMjUgMjk1Ljk2IFogTSAzMjguMDI1IDE0OS45OTcgQyAzMzYuODI2IDE0OS45OTcgMzQzLjk3MSAxNTcuMTQgMzQzLjk3MSAxNjUuOTQ4IEMgMzQzLjk3MSAxNzQuNzQ4IDMzNi44MjYgMTgxLjg5MSAzMjguMDI1IDE4MS44OTEgQyAzMTkuMjI0IDE4MS44OTEgMzEyLjA4IDE3NC43NDggMzEyLjA4IDE2NS45NDggQyAzMTIuMDggMTU3LjE0IDMxOS4yMjQgMTQ5Ljk5NyAzMjguMDI1IDE0OS45OTcgWiBNIDE5My4xMDIgMjc2LjMzNSBDIDE3OC4yMyAyNzYuMzM1IDE2Ni4xMTggMjY0LjIyMiAxNjYuMTE4IDI0OS4zNDggQyAxNjYuMTE4IDIzNC40NzQgMTc4LjIzIDIyMi4zNjEgMTkzLjEwMiAyMjIuMzYxIEMgMjA3Ljk3NSAyMjIuMzYxIDIyMC4wODYgMjM0LjQ3NCAyMjAuMDg2IDI0OS4zNDggQyAyMjAuMDg2IDI2NC4yMjIgMjA3Ljk3NSAyNzYuMzM1IDE5My4xMDIgMjc2LjMzNSBaIE0gMzI4LjAyNSAzNDguNzAzIEMgMzE5LjIyNCAzNDguNzAzIDMxMi4wOCAzNDEuNTU4IDMxMi4wOCAzMzIuNzU3IEMgMzEyLjA4IDMyMy45NTcgMzE5LjIyNCAzMTYuODEyIDMyOC4wMjUgMzE2LjgxMiBDIDMzNi44MjYgMzE2LjgxMiAzNDMuOTcxIDMyMy45NTcgMzQzLjk3MSAzMzIuNzU3IEMgMzQzLjk3MSAzNDEuNTU4IDMzNi44MjYgMzQ4LjcwMyAzMjguMDI1IDM0OC43MDMgWiIgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIC8+PC9nPjwvc3ZnPg==";
const MoreIcon =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIHdpZHRoPSI4OTZweCIgaGVpZ2h0PSI4OTZweCIgc3R5bGU9ImZpbGw6IzJiN2JlYSI+PHBhdGggZD0iTTE3NiA1MTFhNTYgNTYgMCAxMDExMiAwIDU2IDU2IDAgMTAtMTEyIDB6bTI4MCAwYTU2IDU2IDAgMTAxMTIgMCA1NiA1NiAwIDEwLTExMiAwem0yODAgMGE1NiA1NiAwIDEwMTEyIDAgNTYgNTYgMCAxMC0xMTIgMHoiPjwvcGF0aD48L3N2Zz4=";
// const FolderIcon =
//   "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZpZXdCb3g9IjAgMCAxNzUuNDMgMTc1LjQzIiB3aWR0aD0iMTc1LjQzcHgiIGhlaWdodD0iMTc1LjQzcHgiIGZpbGw9IiMyYjdiZWEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTSAzLjY2NSA2Ljg3NyBMIDczLjI4NSA2Ljg3NyBDIDc1LjMwOSA2Ljg3NyA3Ni45NSA4LjUxNiA3Ni45NSAxMC41MzggTCA3Ni45NSA4MC4xNjIgQyA3Ni45NSA4Mi4xODMgNzUuMzA5IDgzLjgyNiA3My4yODUgODMuODI2IEwgMy42NjUgODMuODI2IEMgMS42MzkgODMuODI2IDAgODIuMTgzIDAgODAuMTYyIEwgMCAxMC41MzggQyAwIDguNTE2IDEuNjM5IDYuODc3IDMuNjY1IDYuODc3IE0gMTMyLjkwMiAxLjA3MyBMIDE3NC4zNTkgNDIuNTMgQyAxNzUuNzg4IDQzLjk2MSAxNzUuNzg4IDQ2LjI3OCAxNzQuMzU5IDQ3LjcxMiBMIDEzMi45MDIgODkuMTY4IEMgMTMxLjQ3MSA5MC41OTcgMTI5LjE1MiA5MC41OTcgMTI3LjcyMSA4OS4xNjggTCA4Ni4yNjQgNDcuNzEyIEMgODQuODM0IDQ2LjI3OCA4NC44MzQgNDMuOTYxIDg2LjI2NCA0Mi41MyBMIDEyNy43MjEgMS4wNzMgQyAxMjkuMTUyIC0wLjM1NyAxMzEuNDcxIC0wLjM1NyAxMzIuOTAyIDEuMDczIE0gMy42NjUgOTguNDgyIEwgNzMuMjg1IDk4LjQ4MiBDIDc1LjMwOSA5OC40ODIgNzYuOTUgMTAwLjEyMiA3Ni45NSAxMDIuMTQ2IEwgNzYuOTUgMTcxLjc2OCBDIDc2Ljk1IDE3My43OTEgNzUuMzA5IDE3NS40MzIgNzMuMjg1IDE3NS40MzIgTCAzLjY2NSAxNzUuNDMyIEMgMS42MzkgMTc1LjQzMiAwIDE3My43OTEgMCAxNzEuNzY4IEwgMCAxMDIuMTQ2IEMgMCAxMDAuMTIyIDEuNjM5IDk4LjQ4MiAzLjY2NSA5OC40ODIgTSA5NS4yNzEgOTguNDgyIEwgMTY0Ljg5MyA5OC40ODIgQyAxNjYuOTE3IDk4LjQ4MiAxNjguNTU4IDEwMC4xMjIgMTY4LjU1OCAxMDIuMTQ2IEwgMTY4LjU1OCAxNzEuNzY4IEMgMTY4LjU1OCAxNzMuNzkxIDE2Ni45MTcgMTc1LjQzMiAxNjQuODkzIDE3NS40MzIgTCA5NS4yNzEgMTc1LjQzMiBDIDkzLjI0OCAxNzUuNDMyIDkxLjYwNyAxNzMuNzkxIDkxLjYwNyAxNzEuNzY4IEwgOTEuNjA3IDEwMi4xNDYgQyA5MS42MDcgMTAwLjEyMiA5My4yNDggOTguNDgyIDk1LjI3MSA5OC40ODIiIC8+PC9zdmc+";
const DefaultFolderIcon =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIHdpZHRoPSI4OTZweCIgaGVpZ2h0PSI4OTZweCIgc3R5bGU9ImZpbGw6IzJiN2JlYSI+PHBhdGggZD0iTTE2MCAxNDRoMzA0YTE2IDE2IDAgMDExNiAxNnYzMDRhMTYgMTYgMCAwMS0xNiAxNkgxNjBhMTYgMTYgMCAwMS0xNi0xNlYxNjBhMTYgMTYgMCAwMTE2LTE2bTU2NC4zMS0yNS4zM2wxODEuMDIgMTgxLjAyYTE2IDE2IDAgMDEwIDIyLjYyTDcyNC4zMSA1MDMuMzNhMTYgMTYgMCAwMS0yMi42MiAwTDUyMC42NyAzMjIuMzFhMTYgMTYgMCAwMTAtMjIuNjJsMTgxLjAyLTE4MS4wMmExNiAxNiAwIDAxMjIuNjIgME0xNjAgNTQ0aDMwNGExNiAxNiAwIDAxMTYgMTZ2MzA0YTE2IDE2IDAgMDEtMTYgMTZIMTYwYTE2IDE2IDAgMDEtMTYtMTZWNTYwYTE2IDE2IDAgMDExNi0xNm00MDAgMGgzMDRhMTYgMTYgMCAwMTE2IDE2djMwNGExNiAxNiAwIDAxLTE2IDE2SDU2MGExNiAxNiAwIDAxLTE2LTE2VjU2MGExNiAxNiAwIDAxMTYtMTYiPjwvcGF0aD48L3N2Zz4=";

interface Props {
  data: FlowNode.INode;
  setCurEdit: (data: FlowNode.INode) => void;
  onDelete: (id: string, name: string) => void;
  onCollect: (id: string, collected: boolean) => void;
  onItemClick: (data: FlowNode.INode) => void;
}

const Component: FC<Props> = ({ data, setCurEdit, onDelete, onCollect, onItemClick }) => {
  return (
    <div className={classnames(styles.NodeListItem, "g-card", { folder: data.isFolder })} onClick={() => onItemClick(data)}>
      <span
        className={classnames("g-star absolute", { on: data.collected })}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onCollect(data.id, !data.collected);
        }}
      >
        <Star />
      </span>
      <div className="head-icon">
        <img className="icon" alt="node" src={data.icon || (data.isFolder ? DefaultFolderIcon : DefaultIcon)} />
        <h4 className="title">{data.name}</h4>
        <div className={classnames("info", data.isFolder ? "g-dot" : `${styles.NodeListItem}__package`)}>
          {data.isFolder ? (
            <span>{data.package}</span>
          ) : (
            <>
              <ExternalLink className="icon" size={10} />
              <a className="link">{data.package}</a>
            </>
          )}
        </div>
      </div>
      <div className="summary" title={data.desc}>
        {data.desc}
      </div>
      {!data.isFolder && (
        <div className="footer">
          <Likes likesNum={data.likes} />
          <div>v1.0.0</div>
        </div>
      )}
      <div className="tools">
        <div
          title="编辑"
          className="btn"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setCurEdit(data);
          }}
        >
          <SquarePen size={13} />
        </div>
        <div
          title="删除"
          className="btn"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete(data.id, data.name);
          }}
        >
          <Trash2 size={13} />
        </div>
      </div>
    </div>
  );
};

export default memo(Component);
