import { Breadcrumb } from "antd";
import classnames from "classnames";
import { ArrowLeft, FolderOpen, RefreshCcw } from "lucide-react";
import type { FC, MouseEvent, ReactNode } from "react";
import { memo, useMemo } from "react";
import { useEvent } from "@/utils/hooks";
import "./index.scss";

export interface Props {
  onBack?: () => void;
  onRoute: (path: string, isRoot: boolean) => void;
  items: { title: string; path: string; current?: boolean }[];
  showBack: boolean;
  refreshIcon?: ReactNode;
}
const Component: FC<Props> = ({ items, onRoute, onBack, showBack, refreshIcon }) => {
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
      onRoute(item.dataset.id, item.className.includes("root"));
    }
  });

  const itemRender = useEvent((item: { title: string; path: string; current?: boolean }) => {
    if (item.current) {
      return item.title ? (
        <>
          <span className={classnames("current", { root: item.path === "/" })} style={{ marginRight: "3px" }}>
            {item.title}
          </span>
          <a className={classnames("refresh", { root: item.path === "/" })} data-id="">
            {refreshIcon || <RefreshCcw className="anticon" size={11} strokeWidth={2.5} />}
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
  });

  if (!items.length) {
    return <div className="comp-Pathcrumb" onClick={onClick}></div>;
  }
  return (
    <div className="comp-Pathcrumb" onClick={onClick}>
      {showBack && (
        <span className="back" title="后退" onClick={onBack}>
          <ArrowLeft size={14} />
        </span>
      )}
      <Breadcrumb items={datasource} itemRender={itemRender as any} />
    </div>
  );
};

export default memo(Component);
