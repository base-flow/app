import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TablePaginationConfig } from "antd";
import type { RefObject } from "react";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";
import Pathcrumb from "@/components/Pathcrumb";
import { FavoriteAPI } from "@/modules/favorite/api";
import { deepEqual } from "@/utils/tools";

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

export function useFolderRoute<Q extends { [key: string]: any } = { [key: string]: any }>(
  rootName: string,
  rootDir: string | undefined,
  query: Q,
  listPath: string | undefined,
  setQuery: (query: Q) => void,
) {
  const history = useRef<Q[]>([]);
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
}

export const ShowTotal = (total: number) => `${total} Items`;

export function useTablePagination(listSummary: _Resource.IQuerySummary | undefined): TablePaginationConfig {
  const pagination: TablePaginationConfig = useMemo(
    () => ({
      className: "g-pagination",
      size: "default",
      placement: ["bottomCenter"],
      showTotal: ShowTotal,
      showQuickJumper: false,
      showSizeChanger: false,
      current: listSummary?.page,
      pageSize: listSummary?.pageSize,
      total: listSummary?.total,
    }),
    [listSummary],
  );
  return pagination;
}

export function useTableChange<Q extends _Resource.IQuery>(query: Q, setQuery: (query: Q) => void) {
  const onTableChange = useEvent(
    (paginate: { current?: number; pageSize?: number }, _filters: any, sort: any, extra: { action: "paginate" | "sort" | "filter" }) => {
      if (extra.action === "paginate") {
        setQuery({ ...query, page: paginate.current });
      } else if (extra.action === "sort") {
        setQuery({ ...query, page: undefined, sorterField: sort.field, sorterOrder: sort.order });
      }
    },
  );
  const onDirSearch = useEvent((keyword?: string) => {
    const { dir, type } = query as any;
    setQuery({ dir, type, keyword } as any);
  });
  return { onTableChange, onDirSearch };
}

export function useMyFavoriteIds() {
  const queryClient = useQueryClient();
  const favoriteQuery = useQuery(FavoriteAPI.queryIds());
  const favoriteList = favoriteQuery.data;
  const favoriteMap = useMemo(() => {
    if (favoriteList) {
      return favoriteList.reduce(
        (obj, id) => {
          obj[id] = true;
          return obj;
        },
        {} as { [id: string]: boolean },
      );
    } else {
      return {};
    }
  }, [favoriteList]);

  const favoriteUpdater = useMutation({
    mutationFn: FavoriteAPI.batchUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FavoriteAPI.listQueryKey] });
      queryClient.invalidateQueries({ queryKey: [FavoriteAPI.idsQueryKey] });
    },
  });

  const onFavoriteChange = useEvent((id: string, fav: boolean) => favoriteUpdater.mutate({ ids: [id], fav }));
  const onFavoriteRemove = useEvent((ids: string[]) => favoriteUpdater.mutate({ ids, fav: false }));
  return { favoriteMap, favoriteLoading: favoriteQuery.isFetching, onFavoriteRemove, onFavoriteChange };
}

export function useMyFavoriteList(onChangeSuccess?: () => void) {
  const queryClient = useQueryClient();
  const favoriteQuery = useQuery(FavoriteAPI.queryList());

  const favoriteUpdater = useMutation({
    mutationFn: FavoriteAPI.batchUpdate,
    onSuccess: () => {
      onChangeSuccess?.();
      queryClient.invalidateQueries({ queryKey: [FavoriteAPI.listQueryKey] });
      queryClient.invalidateQueries({ queryKey: [FavoriteAPI.idsQueryKey] });
    },
  });

  const onFavoriteChange = useEvent((id: string, fav: boolean) => favoriteUpdater.mutate({ ids: [id], fav }));
  const onFavoriteRemove = useEvent((ids: string[]) => favoriteUpdater.mutate({ ids, fav: false }));
  return { favoriteQuery, onFavoriteRemove, onFavoriteChange };
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
