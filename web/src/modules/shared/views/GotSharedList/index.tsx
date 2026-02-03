import { BaseWidgets } from "@baseflow/react";
import { Icons, StringInput } from "@baseflow/widgets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Result, Space } from "antd";
import classnames from "classnames";
import { Info, Link, Plus } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import FieldSorter from "@/components/FieldSorter";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import SkeletonCardList from "@/components/SkeletonCardList";
import { FlagSrc } from "@/components/utils";
import { useEvent, usePermissions } from "@/utils/hooks";
import { debounce, openEntity, sortList } from "@/utils/tools";
import { SharedAPI } from "../../api";
import GotSharedCard from "../GotSharedCard";
import styles from "./index.module.scss";

const Component: FC = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const sharedQuery = useQuery(SharedAPI.queryGotList());
  const [query, setQuery] = useState<{ sorterField?: string; sorterOrder?: "ascend" | "descend" }>({});
  const sharedList = useMemo(() => {
    let list = sharedQuery.data;
    const { sorterOrder, sorterField } = query;
    if (list && sorterField && sorterOrder) {
      list = sortList(list, sorterField, sorterOrder);
    }
    return list;
  }, [sharedQuery.data, query]);
  const [curEdit, setCurEdit] = useState<_Project.IProject>();

  const onSort = useEvent((sorter: { sorterField?: string; sorterOrder?: "ascend" | "descend" }) => {
    setQuery(sorter);
  });

  const onCreate = useEvent(() => {
    setCurEdit({ logo: FlagSrc.create() } as _Project.IProject);
  });

  const sharedDeleter = useMutation({
    mutationFn: SharedAPI.deleteGotItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SharedAPI.gotListQueryKey] });
    },
  });

  const onDelete = useEvent((id: string, name: string) => {
    BaseWidgets.confirm(`确定要删除“${name}”吗？`, (ok) => {
      if (ok) {
        //entityDeleter.mutate([id]);
      }
    });
  });

  // // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  // useEffect(() => {
  //   console.log("set top 0");
  //   if (scrollerRef.current) {
  //     scrollerRef.current!.scrollTop = 0;
  //   }
  // }, [query]);

  if (sharedQuery.isError) {
    return (
      <section className="g-page">
        <Result status="warning" title={sharedQuery.error.message || "错误"} />
      </section>
    );
  }

  if (!sharedList) {
    return (
      <section className="g-page">
        <div className="hd" />
        <div className="bd">
          <SkeletonCardList />
        </div>
      </section>
    );
  }

  return (
    <section className="g-page">
      <LoadingMask show={sharedQuery.isFetching || sharedDeleter.isPending} />
      <div className={classnames("hd", `${styles.GotSharedList}__hd`)}>
        <div className="tips">
          <Info size={12} />
          过期的分享将会被系统自动清理
        </div>
        <div>
          <span>分享链接：</span>
          <Space.Compact>
            <StringInput style={{ width: "400px" }} variant="filled" prefix={<Link size={12} />} />
            <Button type="primary" icon={<Plus strokeWidth={2.5} size={13} />}>
              添加
            </Button>
          </Space.Compact>
        </div>
      </div>
      <div className="bd" ref={scrollerRef}>
        <div className="g-grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 2k:grid-cols-6">
          {sharedList.map((item) => {
            return <GotSharedCard key={item.id} item={item} onDelete={onDelete} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(Component);
