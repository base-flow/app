import { type RefObject, useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";
import Pathcrumb from "@/components/Pathcrumb";

// biome-ignore lint/complexity/noBannedTypes: <>
export function useEvent<F extends Function>(fn: F): F {
  const fnRef = useRef<F>(fn);
  // why not write `fnRef.current = fn`?
  // https://github.com/alibaba/hooks/issues/728
  fnRef.current = useMemo<F>(() => fn, [fn]);

  const memoizedFn = useRef<F>(undefined);
  if (!memoizedFn.current) {
    memoizedFn.current = function (this: any, ...args: any) {
      return fnRef.current.apply(this, args);
    } as any;
  }

  return memoizedFn.current!;
}

export function useInfiniteList(fetchNextPage: () => void): [RefObject<HTMLDivElement | null>, (node?: Element | null | undefined) => void] {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const options = { root: scrollerRef.current, threshold: 0.5 };
  // const ref = useOnInView(
  //   (inView) => {
  //     if (inView) {
  //       console.log("on inView");
  //       source.fetchNextPage();
  //     }
  //   },
  //   options,
  // );

  // useEffect(() => {
  //   setInViewRef(loaderRef.current);
  // }, [loaderRef.current]);

  const [loaderRef, inView] = useInView(options);

  useEffect(() => {
    if (inView) {
      console.log("on inView");
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return [scrollerRef, loaderRef];
}

export function useFolderRoute(
  query: { [key: string]: any },
  setQuery: (query: { [key: string]: any }) => void,
  resetQuery: () => { [key: string]: any },
  listSummary: App.ISummary | undefined,
) {
  const breadcrumbCache = useRef<{ [path: string]: { query: { [key: string]: any } } }>({});

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  const currentPath = useMemo(() => {
    const pathData = listSummary?.path || [];
    const currentPath = pathData.map((item) => item[0]).join(" ");
    const currentId = currentPath ? pathData[pathData.length - 1][0] : "/";
    const queryCache = breadcrumbCache.current;
    breadcrumbCache.current = [["/", "/"], ...pathData].reduce(
      (obj, cur) => {
        obj[cur[0]] = queryCache[cur[0]];
        return obj;
      },
      {} as { [path: string]: { query: { [key: string]: any } } },
    );
    breadcrumbCache.current[currentId] = { query };
    return currentPath;
  }, [listSummary]);

  const onBreadcrumbRoute = useEvent((path: string) => {
    if (path) {
      const queryCache = breadcrumbCache.current[path] || {};
      setQuery({ ...queryCache.query, parent: path === "/" ? undefined : path });
    } else {
      setQuery(resetQuery());
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  const breadcrumb = useMemo(() => {
    if (!currentPath) {
      return null;
    }
    const items: { title: string; path?: string }[] = listSummary!.path!.map(([id, title]) => ({ path: id, title }));
    return <Pathcrumb items={items} onRoute={onBreadcrumbRoute} />;
  }, [currentPath]);

  return breadcrumb;
}
