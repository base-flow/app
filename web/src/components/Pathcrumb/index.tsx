import { Breadcrumb } from "antd";
import { FolderOpen, Home, RefreshCcw } from "lucide-react";
import type { FC, MouseEvent } from "react";
import { memo, useMemo } from "react";
import { useEvent } from "@/utils/hooks";
import "./index.scss";

function itemRender(item: any) {
  if (item.path === undefined) {
    return (
      <>
        <span className="current" style={{ marginRight: "3px" }}>
          {item.title}
        </span>
        <a className="refresh" data-id="">
          <RefreshCcw className="anticon" size={11} strokeWidth={2.5} />
        </a>
      </>
    );
  } else {
    return <a data-id={item.path}>{item.path === "/" ? <FolderOpen className="anticon" size={13} /> : item.title}</a>;
  }
}

export interface Props {
  onRoute?: (path: string) => void;
  items: { title: string; path?: string }[];
  title: string;
}
const Component: FC<Props> = ({ items, title, onRoute }) => {
  const datasource = useMemo(() => {
    const data = [{ title: "/", path: "/" }, ...items];
    const lastItem = data[data.length - 1];
    data[data.length - 1] = { ...lastItem, path: undefined };
    return data;
  }, [items]);

  const onClick = useEvent((e: MouseEvent) => {
    const item = e.target as HTMLElement;
    if (item.nodeName === "A" && typeof item.dataset.id === "string") {
      onRoute?.(item.dataset.id);
    }
  });

  return (
    <div className="comp-Pathcrumb" onClick={onClick}>
      {items.length ? (
        <Breadcrumb items={datasource} itemRender={itemRender} />
      ) : title ? (
        <div className="home">
          <FolderOpen size={14} strokeWidth={2.5} />
          <span>{title}</span>
        </div>
      ) : null}
    </div>
  );
};

export default memo(Component);
