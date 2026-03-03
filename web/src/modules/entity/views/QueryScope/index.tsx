import { Segmented } from "antd";
import { FolderDown, FolderTree } from "lucide-react";
import type { FC } from "react";
import { memo } from "react";

const ScropOptions: { label: any; value: boolean; tooltip: string }[] = [
  { label: <FolderDown className="g-vertical" size={14} />, value: false, tooltip: "子级列表" },
  { label: <FolderTree className="g-vertical" size={14} />, value: true, tooltip: "后代平铺" },
];

export interface QueryScopeProps {
  value?: boolean;
  onChange: (value?: boolean) => void;
}

const Component: FC<QueryScopeProps> = ({ value, onChange }) => {
  return <Segmented value={!!value} options={ScropOptions} onChange={onChange} />;
};

export default memo(Component);
