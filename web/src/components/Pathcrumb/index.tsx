import { Breadcrumb } from "antd";
import classnames from "classnames";
import { FolderOpen, RefreshCcw } from "lucide-react";
import type { FC, MouseEvent } from "react";
import { memo, useMemo } from "react";
import { useEvent } from "@/utils/hooks";
import "./index.scss";

function itemRender(item: { title: string; path: string; current?: boolean }) {
  if (item.current) {
    return item.title ? (
      <>
        <span className={classnames("current", { root: item.path === "/" })} style={{ marginRight: "3px" }}>
          {item.title}
        </span>
        <a className={classnames("refresh", { root: item.path === "/" })} data-id="">
          <RefreshCcw className="anticon" size={11} strokeWidth={2.5} />
        </a>
      </>
    ) : null;
  } else {
    return (
      <a data-id={item.path} className={classnames({ root: item.path === "/" })}>
        {item.path === "/" ? <FolderOpen className="anticon" size={13} /> : item.title}
      </a>
    );
  }
}

export interface Props {
  onRoute?: (path: string, isRoot: boolean) => void;
  items: { title: string; path: string; current?: boolean }[];
}
const Component: FC<Props> = ({ items, onRoute }) => {
  const datasource = useMemo(() => {
    if (items.length) {
      const clone = [...items];
      clone[clone.length - 1] = { ...clone[clone.length - 1], current: true };
      return clone;
    } else {
      return items;
    }
  }, [items]);

  const onClick = useEvent((e: MouseEvent) => {
    const item = e.target as HTMLElement;
    if (item.nodeName === "A" && typeof item.dataset.id === "string") {
      onRoute?.(item.dataset.id, item.className.includes("root"));
    }
  });

  if (!items.length) {
    return <div className="comp-Pathcrumb" onClick={onClick}></div>;
  }
  return (
    <div className="comp-Pathcrumb" onClick={onClick}>
      <Breadcrumb items={datasource} itemRender={itemRender as any} />
    </div>
  );
};

export default memo(Component);
