import { Breadcrumb } from "antd";
import { Home } from "lucide-react";
import type { FC, MouseEvent } from "react";
import { memo } from "react";
import { useEvent } from "@/utils/tools";
import "./index.scss";

function itemRender(item: any) {
  if (typeof item.path === "string") {
    if (item.path) {
      return <a data-id={item.path}>{item.title}</a>;
    } else {
      return (
        <a data-id={item.path}>
          <Home style={{ pointerEvents: "none" }} />
        </a>
      );
    }
  } else {
    return <span>{item.title}</span>;
  }
}

export interface Props {
  onRoute?: (path: string) => void;
  after?: string;
  items: { title: string; path?: string }[];
}
const Component: FC<Props> = ({ items, onRoute, after }) => {
  const onClick = useEvent((e: MouseEvent) => {
    const item = e.target as HTMLElement;
    if (item.nodeName === "A" && typeof item.dataset.id === "string") {
      onRoute?.(item.dataset.id);
    }
  });

  return (
    <div className="widget-Pathcrumb" onClick={onClick}>
      <Breadcrumb items={[{ title: "", path: "" }, ...items]} itemRender={itemRender} />
      {after && <span>{after}</span>}
    </div>
  );
};

export default memo(Component);
