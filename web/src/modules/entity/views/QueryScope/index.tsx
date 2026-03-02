import { Segmented } from "antd";
import { FolderDown, FolderTree } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";
import { useEvent } from "@/utils/hooks";

const ScropOptions: { label: any; value: string; tooltip: string }[] = [
  { label: <FolderDown className="g-vertical" size={14} />, value: "", tooltip: "子级列表" },
  { label: <FolderTree className="g-vertical" size={14} />, value: "descendants", tooltip: "后代平铺" },
];

export interface QueryScopeProps {
  value?: "descendants";
  onChange: (value?: "descendants") => void;
}

const Component: FC<QueryScopeProps> = ({ value, onChange }) => {
  const _onChange = useEvent((val: any) => onChange(val || undefined));
  return <Segmented value={value || ""} options={ScropOptions} onChange={_onChange} />;
};

export default memo(Component);
