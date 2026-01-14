import { Breadcrumb } from "antd";
import { Home, RefreshCcw } from "lucide-react";
import type { FC, MouseEvent } from "react";
import { memo, useMemo } from "react";
import { useEvent } from "@/utils/hooks";
import "./index.scss";

function itemRender(item: any) {
  if (item.path === undefined) {
    return (
      <>
        <span style={{ marginRight: "3px" }}>{item.title}</span>
        <a className="refresh" data-id="">
          <RefreshCcw className="anticon" size={11} strokeWidth={2.5} />
        </a>
      </>
    );
  } else {
    return <a data-id={item.path}>{item.path === "/" ? <Home className="anticon" size={13} /> : item.title}</a>;
  }
}

export interface Props {
  onRoute?: (path: string) => void;
  items: { title: string; path?: string }[];
}
const Component: FC<Props> = ({ items, onRoute }) => {
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
      <Breadcrumb items={datasource} itemRender={itemRender} />
    </div>
  );
};

export default memo(Component);
