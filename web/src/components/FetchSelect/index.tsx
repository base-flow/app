import type { SelectProps } from "antd";
import { Select, Spin } from "antd";
import { memo, useMemo, useRef, useState } from "react";
import { debounce } from "@/utils/tools";

const Loading = <Spin size="small" />;

export interface ValueType {
  disabled?: boolean;
  label: React.ReactNode;
  value: string | number;
}
interface DebounceSelectProps<T extends ValueType> extends Omit<SelectProps<T | T[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<T[]>;
  debounceTimeout?: number;
}

function Component<T extends ValueType = any>({
  fetchOptions,
  debounceTimeout = 500,
  placeholder = "请输入搜索关键字...",
  ...props
}: DebounceSelectProps<T>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<T[]>([]);
  const fetchRef = useRef(0);

  const showSearch = useMemo(() => {
    const onSearch = debounce((value: string) => {
      setOptions([]);
      if (value) {
        fetchRef.current += 1;
        const fetchId = fetchRef.current;
        setFetching(true);
        fetchOptions(value).then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            return;
          }
          setOptions(newOptions);
          setFetching(false);
        });
      }
    }, debounceTimeout);
    return { filterOption: false, onSearch };
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      showSearch={showSearch}
      notFoundContent={fetching ? Loading : "No results found"}
      {...props}
      placeholder={placeholder}
      options={options}
    />
  );
}
export default memo(Component) as typeof Component;
