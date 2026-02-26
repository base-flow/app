import type { SchemaModel } from "@baseflow/react";
import { BaseWidgets, SchemaModelForm } from "@baseflow/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBlocker } from "@tanstack/react-router";
import { Button } from "antd";
import type { FC } from "react";
import { memo, useEffect, useState } from "react";
import { useEvent } from "@/utils/hooks";
import { DataAPI } from "../../api";
import Header from "./Header";
import styles from "./index.module.scss";

interface Props {
  item: _Data.IData & _Data.IDataDetail;
}

const Component: FC<Props> = ({ item }) => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState(item.content);
  const [schema, setSchema] = useState<SchemaModel | undefined>(item.content ? JSON.parse(item.content) : undefined);

  console.log(schema);

  useBlocker({
    shouldBlockFn: () => {
      if (content === item.content) return false;
      return !window.confirm("你有未保存内容，确定离开吗？");
    },
  });

  const dataUpdater = useMutation({
    mutationFn: DataAPI.updateItem,
    onSuccess: () => {
      BaseWidgets.message.success("保存成功！");
      queryClient.invalidateQueries({ queryKey: [DataAPI.itemQueryKey] });
    },
  });

  const onSave = useEvent(() => {
    dataUpdater.mutate({ id: item.id, content: "" });
  });

  return (
    <div className={styles.DataItem}>
      <Header item={item}>
        <Button type="primary" loading={dataUpdater.isPending} disabled={content === item.content} onClick={onSave}>
          保存
        </Button>
      </Header>
      <div className="bd">
        <div className="panel">
          <SchemaModelForm value={schema} onChange={setSchema} showRootTools />
        </div>
      </div>
    </div>
  );
};

export default memo(Component);
