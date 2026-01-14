import { Input } from "antd";
import classnames from "classnames";
import { Search } from "lucide-react";
import type { CSSProperties, FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { useEvent } from "@/utils/hooks";
import "./index.scss";

const SearchIcon = <Search size={14} />;

const SearchInput: FC<{
  className?: string;
  style?: CSSProperties;
  placeholder?: string;
  width?: string;
  variant?: "filled";
  value?: string;
  onChange?: (value?: string) => void;
}> = (props) => {
  const { className, style, variant, width = "300px", placeholder = "关键字搜索...", onChange } = props;

  const [value, setValue] = useState(props.value);

  useMemo(() => setValue(props.value), [props.value]);

  const onSubmit = useEvent(() => {
    if (value !== props.value) {
      onChange?.(value);
    }
  });

  const onClear = useCallback(() => {
    onChange?.(undefined);
  }, [onChange]);

  const onInput = useCallback((e: any) => {
    setValue(e.target.value.trim());
  }, []);

  return (
    <Input
      className={classnames("comp-SearchInput", className)}
      placeholder={placeholder}
      value={value}
      onChange={onInput}
      prefix={SearchIcon}
      style={width ? { ...style, width } : style}
      onClear={onClear}
      allowClear
      variant={variant}
      onPressEnter={onSubmit}
      onBlur={onSubmit}
    />
  );
};

export default SearchInput;
