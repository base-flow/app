import { Tooltip } from "antd";
import classnames from "classnames";
import { ExternalLink, FolderSymlink, SquarePen, Trash2 } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import Collect from "@/components/Collect";
import IconFolder from "@/components/IconFolder";
import Likes from "@/components/Likes";
import { showPath } from "@/utils/tools";
import styles from "./index.module.scss";

const DefaultIcon =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ijg1Ljk1MiA3OC44NzIgMzQwLjk1NyAzNDAuOTU3IiB3aWR0aD0iMzQwLjk1N3B4IiBoZWlnaHQ9IjM0MC45NTdweCI+PGc+PHJlY3QgeD0iODUuOTUyIiB5PSI3OC44NzIiIHdpZHRoPSIzNDAuOTU3IiBoZWlnaHQ9IjM0MC45NTciIHN0eWxlPSJmaWxsOiMyYjdiZWE7IiAvPjxwYXRoIGQ9Ik0gMzI4LjAyNSAyOTUuOTYgQyAzMTkuMjg2IDI5NS45NiAzMTEuMjIxIDI5OS4wMjcgMzA0LjkwNSAzMDQuMTQ4IEwgMjQxLjM2NyAyNTguMTgzIEMgMjQyLjQzMiAyNTIuMzQgMjQyLjQzMiAyNDYuMzU1IDI0MS4zNjcgMjQwLjUyMSBMIDMwNC45MDUgMTk0LjU1NiBDIDMxMS4yMjEgMTk5LjY3NyAzMTkuMjg2IDIwMi43NDEgMzI4LjAyNSAyMDIuNzQxIEMgMzQ4LjMyNSAyMDIuNzQxIDM2NC44MjIgMTg2LjI0NiAzNjQuODIyIDE2NS45NDggQyAzNjQuODIyIDE0NS42NDIgMzQ4LjMyNSAxMjkuMTQ3IDMyOC4wMjUgMTI5LjE0NyBDIDMwNy43MjUgMTI5LjE0NyAyOTEuMjI4IDE0NS42NDIgMjkxLjIyOCAxNjUuOTQ4IEMgMjkxLjIyOCAxNjkuNTAyIDI5MS43MTkgMTcyLjkwNCAyOTIuNjY5IDE3Ni4xNTUgTCAyMzIuMzIyIDIxOS44NSBDIDIyMy4zNjcgMjA3Ljk4NiAyMDkuMTM5IDIwMC4yOTEgMTkzLjEwMiAyMDAuMjkxIEMgMTY1Ljk5NiAyMDAuMjkxIDE0NC4wNCAyMjIuMjQ2IDE0NC4wNCAyNDkuMzQ4IEMgMTQ0LjA0IDI3Ni40NTggMTY1Ljk5NiAyOTguNDEzIDE5My4xMDIgMjk4LjQxMyBDIDIwOS4xMzkgMjk4LjQxMyAyMjMuMzY3IDI5MC43MTcgMjMyLjMyMiAyNzguODQ5IEwgMjkyLjY2OSAzMjIuNTQ2IEMgMjkxLjcxOSAzMjUuNzk3IDI5MS4yMjggMzI5LjIzMSAyOTEuMjI4IDMzMi43NTcgQyAyOTEuMjI4IDM1My4wNTcgMzA3LjcyNSAzNjkuNTU1IDMyOC4wMjUgMzY5LjU1NSBDIDM0OC4zMjUgMzY5LjU1NSAzNjQuODIyIDM1My4wNTcgMzY0LjgyMiAzMzIuNzU3IEMgMzY0LjgyMiAzMTIuNDU3IDM0OC4zMjUgMjk1Ljk2IDMyOC4wMjUgMjk1Ljk2IFogTSAzMjguMDI1IDE0OS45OTcgQyAzMzYuODI2IDE0OS45OTcgMzQzLjk3MSAxNTcuMTQgMzQzLjk3MSAxNjUuOTQ4IEMgMzQzLjk3MSAxNzQuNzQ4IDMzNi44MjYgMTgxLjg5MSAzMjguMDI1IDE4MS44OTEgQyAzMTkuMjI0IDE4MS44OTEgMzEyLjA4IDE3NC43NDggMzEyLjA4IDE2NS45NDggQyAzMTIuMDggMTU3LjE0IDMxOS4yMjQgMTQ5Ljk5NyAzMjguMDI1IDE0OS45OTcgWiBNIDE5My4xMDIgMjc2LjMzNSBDIDE3OC4yMyAyNzYuMzM1IDE2Ni4xMTggMjY0LjIyMiAxNjYuMTE4IDI0OS4zNDggQyAxNjYuMTE4IDIzNC40NzQgMTc4LjIzIDIyMi4zNjEgMTkzLjEwMiAyMjIuMzYxIEMgMjA3Ljk3NSAyMjIuMzYxIDIyMC4wODYgMjM0LjQ3NCAyMjAuMDg2IDI0OS4zNDggQyAyMjAuMDg2IDI2NC4yMjIgMjA3Ljk3NSAyNzYuMzM1IDE5My4xMDIgMjc2LjMzNSBaIE0gMzI4LjAyNSAzNDguNzAzIEMgMzE5LjIyNCAzNDguNzAzIDMxMi4wOCAzNDEuNTU4IDMxMi4wOCAzMzIuNzU3IEMgMzEyLjA4IDMyMy45NTcgMzE5LjIyNCAzMTYuODEyIDMyOC4wMjUgMzE2LjgxMiBDIDMzNi44MjYgMzE2LjgxMiAzNDMuOTcxIDMyMy45NTcgMzQzLjk3MSAzMzIuNzU3IEMgMzQzLjk3MSAzNDEuNTU4IDMzNi44MjYgMzQ4LjcwMyAzMjguMDI1IDM0OC43MDMgWiIgc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIC8+PC9nPjwvc3ZnPg==";
("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIHdpZHRoPSI4OTZweCIgaGVpZ2h0PSI4OTZweCIgc3R5bGU9ImZpbGw6IzJiN2JlYSI+PHBhdGggZD0iTTE2MCAxNDRoMzA0YTE2IDE2IDAgMDExNiAxNnYzMDRhMTYgMTYgMCAwMS0xNiAxNkgxNjBhMTYgMTYgMCAwMS0xNi0xNlYxNjBhMTYgMTYgMCAwMTE2LTE2bTU2NC4zMS0yNS4zM2wxODEuMDIgMTgxLjAyYTE2IDE2IDAgMDEwIDIyLjYyTDcyNC4zMSA1MDMuMzNhMTYgMTYgMCAwMS0yMi42MiAwTDUyMC42NyAzMjIuMzFhMTYgMTYgMCAwMTAtMjIuNjJsMTgxLjAyLTE4MS4wMmExNiAxNiAwIDAxMjIuNjIgME0xNjAgNTQ0aDMwNGExNiAxNiAwIDAxMTYgMTZ2MzA0YTE2IDE2IDAgMDEtMTYgMTZIMTYwYTE2IDE2IDAgMDEtMTYtMTZWNTYwYTE2IDE2IDAgMDExNi0xNm00MDAgMGgzMDRhMTYgMTYgMCAwMTE2IDE2djMwNGExNiAxNiAwIDAxLTE2IDE2SDU2MGExNiAxNiAwIDAxLTE2LTE2VjU2MGExNiAxNiAwIDAxMTYtMTYiPjwvcGF0aD48L3N2Zz4=");

interface EntityCardProps {
  item: _Entity.IEntity;
  permissions: _Permission.IPermissions;
  authId: string;
  favoriteMap: { [id: string]: boolean };
  setCurEdit: (item: _Entity.IEntity) => void;
  onDelete: (id: string, name: string) => void;
  onFavoriteChange: (id: string, collected: boolean) => void;
  onItemClick: (item: _Entity.IEntity) => void;
}

const Component: FC<EntityCardProps> = ({ item, permissions, authId, favoriteMap, setCurEdit, onDelete, onFavoriteChange, onItemClick }) => {
  if (item.type === "directory") {
    return (
      <div className={classnames(styles.EntityCard, "g-card folder")} onClick={() => onItemClick(item)}>
        {item.path ? (
          <Tooltip placement="bottom" title={showPath(item.path)}>
            <span className="path">
              <FolderSymlink size={12} strokeWidth={2.5} />
            </span>
          </Tooltip>
        ) : null}
        <Collect absolute id={item.id} value={favoriteMap[item.id]} onChange={onFavoriteChange} />
        <div className="head-icon">
          <IconFolder className="icon" size={30} />
          <h4 className="title">{item.name}</h4>
          <div className="info g-dot">
            <span>xxx</span>
          </div>
        </div>
        <div className="summary" title={item.desc}>
          {item.desc}
        </div>
        {(permissions.node_edit === "all" ||
          (permissions.node_edit === "owner" && item.createBy === authId) ||
          permissions.node_delete === "all" ||
          (permissions.node_delete === "owner" && item.createBy === authId)) && (
          <div className="tools">
            {permissions.node_edit === "all" ||
              (permissions.node_edit === "owner" && item.createBy === authId && (
                <div
                  title="编辑"
                  className="btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCurEdit(item);
                  }}
                >
                  <SquarePen size={13} />
                </div>
              ))}
            {permissions.node_delete === "all" ||
              (permissions.node_delete === "owner" && item.createBy === authId && (
                <div
                  title="删除"
                  className="btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDelete(item.id, item.name);
                  }}
                >
                  <Trash2 size={13} />
                </div>
              ))}
          </div>
        )}
      </div>
    );
  } else if (item.type === "workflow") {
    return (
      <div className={classnames(styles.EntityCard, "g-card")} onClick={() => onItemClick(item)}>
        {item.path ? (
          <Tooltip placement="bottom" title={showPath(item.path)}>
            <span className="path">
              <FolderSymlink size={12} strokeWidth={2.5} />
            </span>
          </Tooltip>
        ) : null}
        <Collect absolute id={item.id} value={favoriteMap[item.id]} onChange={onFavoriteChange} />
        <div className="head-icon">
          <img className="icon" alt="node" src={item.icon || DefaultIcon} />
          <h4 className="title">{item.name}</h4>
          <div className={classnames("info", `${styles.EntityCard}__package`)}>
            <ExternalLink className="icon" size={10} />
            <a className="link">xxx</a>
          </div>
        </div>
        <div className="summary" title={item.desc}>
          {item.desc}
        </div>
        <div className="footer">
          <Likes likesNum={item.likes} />
          <div>v1.0.0</div>
        </div>
        {(permissions.node_edit === "all" ||
          (permissions.node_edit === "owner" && item.createBy === authId) ||
          permissions.node_delete === "all" ||
          (permissions.node_delete === "owner" && item.createBy === authId)) && (
          <div className="tools">
            {permissions.node_edit === "all" ||
              (permissions.node_edit === "owner" && item.createBy === authId && (
                <div
                  title="编辑"
                  className="btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCurEdit(item);
                  }}
                >
                  <SquarePen size={13} />
                </div>
              ))}
            {permissions.node_delete === "all" ||
              (permissions.node_delete === "owner" && item.createBy === authId && (
                <div
                  title="删除"
                  className="btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDelete(item.id, item.name);
                  }}
                >
                  <Trash2 size={13} />
                </div>
              ))}
          </div>
        )}
      </div>
    );
  } else if (item.type === "node") {
    return (
      <div className={classnames(styles.EntityCard, "g-card")} onClick={() => onItemClick(item)}>
        {item.path ? (
          <Tooltip placement="bottom" title={showPath(item.path)}>
            <span className="path">
              <FolderSymlink size={12} strokeWidth={2.5} />
            </span>
          </Tooltip>
        ) : null}
        <Collect absolute id={item.id} value={favoriteMap[item.id]} onChange={onFavoriteChange} />
        <div className="head-icon">
          <img className="icon" alt="node" src={item.icon || DefaultIcon} />
          <h4 className="title">{item.name}</h4>
          <div className={classnames("info", `${styles.EntityCard}__package`)}>
            <ExternalLink className="icon" size={10} />
            <a className="link">{item.package}</a>
          </div>
        </div>
        <div className="summary" title={item.desc}>
          {item.desc}
        </div>
        <div className="footer">
          <Likes likesNum={item.likes} />
          <div>v1.0.0</div>
        </div>
        {(permissions.node_edit === "all" ||
          (permissions.node_edit === "owner" && item.createBy === authId) ||
          permissions.node_delete === "all" ||
          (permissions.node_delete === "owner" && item.createBy === authId)) && (
          <div className="tools">
            {permissions.node_edit === "all" ||
              (permissions.node_edit === "owner" && item.createBy === authId && (
                <div
                  title="编辑"
                  className="btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCurEdit(item);
                  }}
                >
                  <SquarePen size={13} />
                </div>
              ))}
            {permissions.node_delete === "all" ||
              (permissions.node_delete === "owner" && item.createBy === authId && (
                <div
                  title="删除"
                  className="btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDelete(item.id, item.name);
                  }}
                >
                  <Trash2 size={13} />
                </div>
              ))}
          </div>
        )}
      </div>
    );
  } else {
    return <div className={classnames(styles.EntityCard, "g-card")} onClick={() => onItemClick(item)}></div>;
  }
};

export default memo(Component);
