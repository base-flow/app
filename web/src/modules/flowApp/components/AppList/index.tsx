import { BaseWidgets, useEvent } from "@baseflow/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { Button, Result } from "antd";
import { SquarePen, SquarePlus, Trash2 } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useState } from "react";
import FieldSorter from "@/components/FieldSorter";
import Flag from "@/components/Flag";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import Star from "@/components/Star";
import { FlagSrc } from "@/components/utils";
import { FlowAppAPI } from "../../api";
import AppEdit from "../AppEdit";
import styles from "./index.module.scss";

const AppList: FC<{ query: FlowApp.IQuery }> = ({ query }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [curEdit, setCurEdit] = useState<FlowApp.IApp>();
  const apps = useQuery(FlowAppAPI.queryList(query));
  const appList = apps.data?.list || [];

  const onCreate = useCallback(() => {
    setCurEdit({ logo: FlagSrc.create() } as FlowApp.IApp);
  }, []);

  const onSearch = useEvent((keyword?: string) => {
    router.navigate({ to: "/", search: { ...query, keyword } });
  });

  const onSort = useEvent((sorter: { sorterField?: string; sorterOrder?: "ascend" | "descend" }) => {
    router.navigate({ to: "/apps", search: { ...query, ...sorter } });
  });

  const appDeleter = useMutation({
    mutationFn: FlowAppAPI.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FlowAppAPI.listQueryKey] });
    },
  });

  const appAlter = useMutation({
    mutationFn: FlowAppAPI.editItem,
    onSuccess: (result, args) => {
      queryClient.invalidateQueries({ queryKey: [FlowAppAPI.listQueryKey] });
      queryClient.invalidateQueries({ queryKey: [FlowAppAPI.itemQueryKey, args.id] });
    },
  });

  const onCollect = useCallback(
    (collected: boolean, id: string) => {
      appAlter.mutate({ id, collected });
    },
    [appAlter],
  );

  const onDelete = useCallback(
    (id: string, name: string) => {
      BaseWidgets.confirm(`确定要删除“${name}”吗？`, (ok) => {
        if (ok) {
          appDeleter.mutate(id);
        }
      });
    },
    [appDeleter],
  );

  if (apps.isError) {
    return <Result status="warning" title={apps.error.message || "错误"} />;
  }

  return (
    <section className={`${styles.AppList} g-page`}>
      <LoadingMask show={apps.isFetching} />
      <div className="hd">
        <div>
          <Button color="primary" variant="text" icon={<SquarePlus size={14} />} onClick={onCreate}>
            创建应用
          </Button>
        </div>
        <div className="g-space">
          <SearchInput variant="filled" onChange={onSearch} value={query.keyword} />
          <div>
            <span style={{ marginRight: 2 }}>排序：</span>
            <FieldSorter value={query} onChange={onSort} />
          </div>
        </div>
      </div>
      <div className="bd">
        <div className="g-grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 2k:grid-cols-6">
          {appList.map((item) => {
            return (
              <Link className={`${styles.AppList}__card g-card`} key={item.id} to="/apps/$appId/flows" params={{ appId: item.id }}>
                <Star absolute id={item.id} value={item.collected} onChange={onCollect} />
                <div className="head-icon">
                  <Flag className="icon" src={item.logo} />
                  <h4 className="g-h4">{item.name}</h4>
                  <div className="g-small">{item.updateDate}</div>
                </div>
                <div className="item-summary" title={item.desc}>
                  {item.desc}
                </div>
                <div className="tools">
                  <Button
                    type="text"
                    size="small"
                    title="编辑"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setCurEdit(item);
                    }}
                  >
                    <SquarePen size={13} />
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    title="删除"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onDelete(item.id, item.name);
                    }}
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <AppEdit item={curEdit} setItem={setCurEdit} />
    </section>
  );
};

export default memo(AppList);
