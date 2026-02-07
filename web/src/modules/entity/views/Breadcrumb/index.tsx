import type { FC } from "react";
import { memo, useMemo, useRef } from "react";
import Pathcrumb from "@/components/Pathcrumb";
import { useEvent } from "@/utils/hooks";
import { deepEqual } from "@/utils/tools";

export interface BreadcrumbProps {
  rootName: string;
  rootDir: string;
  query: _Entity.Query;
  listPath: string;
  setQuery: (query: _Entity.Query) => void;
}

const Component: FC<BreadcrumbProps> = ({ rootName, rootDir, query, listPath, setQuery }) => {
  const history = useRef<_Entity.Query[]>([]);
  let historyLength = history.current.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useMemo(() => {
    const arr = history.current;
    const lastItem = arr[arr.length - 1];
    if (!deepEqual(lastItem, query)) {
      arr.push(query);
      historyLength = arr.length;
    }
  }, [query]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  const { pathString, pathData } = useMemo(() => {
    const pathData = listPath
      ? listPath
          .split("/")
          .filter(Boolean)
          .map((item) => item.split(" "))
      : [];
    if (pathData[0]) {
      pathData[0] = ["/", rootName];
    }
    const pathString = pathData.map((item) => item[0]).join(" ");
    if (pathData.length === 1) {
      history.current = [query];
      historyLength = history.current.length;
    }
    return { pathString, pathData };
  }, [listPath]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useMemo(() => {
    if (pathData[0]) {
      pathData[0][1] = rootName;
    }
  }, [rootName]);

  const onBreadcrumbRoute = useEvent((path: string, isRoot: boolean) => {
    if (path) {
      setQuery({ dir: path === "/" ? rootDir : path } as any);
    } else if (isRoot) {
      setQuery({ dir: rootDir } as any);
    } else {
      setQuery({ dir: query.dir } as any);
    }
  });

  const onBack = useEvent(() => {
    history.current.pop();
    const item = history.current.pop();
    if (item) {
      setQuery(item);
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  const breadcrumb = useMemo(() => {
    const items = pathString ? pathData.map(([id, title]) => ({ path: id, title })) : [];
    return <Pathcrumb items={items} showBack={historyLength > 1} onRoute={onBreadcrumbRoute} onBack={onBack} />;
  }, [pathString, historyLength, rootName]);

  return breadcrumb;
};

export default memo(Component);
