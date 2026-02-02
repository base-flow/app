import { Button, Segmented } from "antd";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, FilePen, FilePlusCorner, ThumbsUp } from "lucide-react";
import type { FC, ReactNode } from "react";
import { memo, useMemo } from "react";
import "./index.scss";
import { useEvent } from "@/utils/hooks";

export type SortField = "createDate" | "updateDate" | "likes";

const SortOptions: { [key in SortField]: { value: string; icon: ReactNode; tooltip: string } } = {
  createDate: { value: "createDate", tooltip: "创建时间", icon: <FilePlusCorner className="anticon" size={14} /> },
  updateDate: { value: "updateDate", tooltip: "更新时间", icon: <FilePen className="anticon" size={14} /> },
  likes: { value: "likes", tooltip: "点赞数量", icon: <ThumbsUp className="anticon" size={14} /> },
};

export interface FieldSorterProps {
  value: { sorterField?: string; sorterOrder?: "ascend" | "descend" };
  onChange: (value: { sorterField?: string; sorterOrder?: "ascend" | "descend" }) => void;
  options?: SortField[];
}

const DefaultOptions: SortField[] = ["updateDate", "createDate"];
const DefaultField = "createDate";
const DefaultOrder = "descend";

const Component: FC<FieldSorterProps> = ({ value, onChange, options = DefaultOptions }) => {
  const filedsOptions = useMemo(() => options.map((name) => SortOptions[name]).filter(Boolean), [options]);
  const onFieldChange = useEvent((field: string) => {
    onChange({ sorterField: field === DefaultField ? undefined : field, sorterOrder: value.sorterOrder });
  });
  const onSortChange = useEvent((order: "descend" | "ascend") => {
    onChange({ sorterField: value.sorterField, sorterOrder: order === DefaultOrder ? undefined : order });
  });

  return (
    <div className="comp-FieldSorter">
      <Segmented value={value.sorterField || DefaultField} options={filedsOptions} onChange={onFieldChange} />
      {value.sorterOrder === "ascend" ? (
        <Button type="text" icon={<ArrowUpNarrowWide size={15} />} onClick={() => onSortChange("descend")} />
      ) : (
        <Button type="text" icon={<ArrowDownWideNarrow size={15} />} onClick={() => onSortChange("ascend")} />
      )}
    </div>
  );
};

export default memo(Component);
