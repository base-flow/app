import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TablePaginationConfig } from "antd";
import type { RefObject } from "react";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { FavoriteAPI } from "@/modules/favorite/api";

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
