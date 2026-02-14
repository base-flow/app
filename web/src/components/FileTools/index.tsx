import { Copy, Download, FilePenLine, Share2, Trash2 } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import "./index.scss";

export type FileToolsAction = "share" | "download" | "modify" | "copy" | "delete";

export type FileToolsProps = {
  item: _Entity.IEntity;
  onClick: (item: _Entity.IEntity, action: FileToolsAction) => void;
};

const Component: FC<FileToolsProps> = ({ item, onClick }) => {
  return (
    <div className="comp-FileTools">
      <span title="分享" onClick={() => onClick(item, "share")}>
        <Share2 size={13} />
      </span>
      <span title="下载">
        <Download size={13} onClick={() => onClick(item, "download")} />
      </span>
      <span title="移动/复制">
        <Copy size={13} onClick={() => onClick(item, "copy")} />
      </span>
      <span title="修改" style={{ padding: "2px 5px" }}>
        <FilePenLine size={13} onClick={() => onClick(item, "modify")} />
      </span>
      <span title="删除">
        <Trash2 size={13} onClick={() => onClick(item, "delete")} />
      </span>
    </div>
  );
};

export default memo(Component);
