import type { RefObject } from "react";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
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
  rootName: string,
  query: { [key: string]: any },
  setQuery: (query: { [key: string]: any }) => void,
  resetQuery: () => { [key: string]: any },
  listSummary: _Entity.QuerySummary | undefined,
) {
  const breadcrumbCache = useRef<{ [path: string]: { query: { [key: string]: any } } }>({});

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  const { pathString, pathData } = useMemo(() => {
    const summaryPath = listSummary?.path;
    const pathData = summaryPath
      ? summaryPath
          .split("/")
          .filter(Boolean)
          .map((item) => item.split(" "))
      : [];
    if (pathData[0]) {
      pathData[0] = ["/", rootName];
    }
    const pathString = pathData.map((item) => item[0]).join(" ");
    const currentId = pathString ? pathData[pathData.length - 1][0] : "";
    const queryCache = breadcrumbCache.current;
    breadcrumbCache.current = pathData.reduce(
      (obj, cur) => {
        obj[cur[0]] = queryCache[cur[0]];
        return obj;
      },
      {} as { [path: string]: { query: { [key: string]: any } } },
    );
    if (currentId) {
      breadcrumbCache.current[currentId] = { query };
    }
    return { pathString, pathData };
  }, [listSummary]);

  const onBreadcrumbRoute = useEvent((path: string, isRoot: boolean) => {
    if (path) {
      const queryCache = breadcrumbCache.current[path] || {};
      setQuery({ ...resetQuery(), ...queryCache.query, dir: isRoot ? undefined : path });
    } else if (isRoot) {
      setQuery({ ...resetQuery(), dir: undefined });
    } else {
      setQuery(resetQuery());
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  const breadcrumb = useMemo(() => {
    const items = pathString ? pathData.map(([id, title]) => ({ path: id, title })) : [];
    return <Pathcrumb items={items} onRoute={onBreadcrumbRoute} />;
  }, [pathString]);

  return breadcrumb;
}

export interface IConfigContext {
  config: _App.Config;
}

export const ConfigContext = createContext<IConfigContext>({} as any);

export function useConfig(): IConfigContext {
  return useContext(ConfigContext);
}

export interface IPermissionsContext {
  auth: _App.AuthUser;
  permissions: _Permission.IPermissions;
  getPermissionsInProject: (appId: string) => _Permission.IPermissions;
}

export const PermissionsContext = createContext<IPermissionsContext>({} as any);

export function usePermissions(): IPermissionsContext {
  return useContext(PermissionsContext);
}

export interface IProjectContext {
  project: _Project.IProject;
}

export const ProjectContext = createContext<IProjectContext>({} as any);

export function useProject(): IProjectContext {
  return useContext(ProjectContext);
}

export interface IPersonalContext {
  personal: _Personal.IPersonal;
}

export const PersonalContext = createContext<IPersonalContext>({} as any);

export function usePersonal(): IPersonalContext {
  return useContext(PersonalContext);
}
