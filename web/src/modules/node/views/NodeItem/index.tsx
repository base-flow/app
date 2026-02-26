import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBlocker } from "@tanstack/react-router";
import { Button } from "antd";
import type { FC } from "react";
import { memo, useEffect, useState } from "react";
import { useEvent } from "@/utils/hooks";
import { NodeAPI } from "../../api";
import Header from "./Header";
import styles from "./index.module.scss";

interface Props {
  item: _Node.INode & _Node.INodeDetail;
}

const Component: FC<Props> = ({ item }) => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState(item.content);

  useBlocker({
    shouldBlockFn: () => {
      if (content === item.content) return false;
      return !window.confirm("你有未保存内容，确定离开吗？");
    },
  });

  const nodeUpdater = useMutation({
    mutationFn: NodeAPI.updateItem,
    onSuccess: () => {
      BaseWidgets.message.success("保存成功！");
      queryClient.invalidateQueries({ queryKey: [NodeAPI.itemQueryKey] });
    },
  });

  const onSave = useEvent(() => {
    const value = window.MonacoEditor.getValue();
    nodeUpdater.mutate({ id: item.id, content: value });
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    const MonacoEditor = window.MonacoEditor;
    MonacoEditor.setModel("json");
    MonacoEditor.setValue(item.content);
    const valueHandler = MonacoEditor.onChange(setContent);

    Object.assign(MonacoEditor.dom.style, {
      padding: `56px 0 0`,
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      display: "block",
    });

    return () => {
      valueHandler.dispose();
      Object.assign(MonacoEditor.dom.style, {
        display: "none",
      });
    };
  }, []);

  return (
    <div className={styles.NodeItem}>
      <Header item={item}>
        <Button onClick={() => window.MonacoEditor.format()}>格式化</Button>
        <Button type="primary" loading={nodeUpdater.isPending} disabled={content === item.content} onClick={onSave}>
          保存
        </Button>
      </Header>
      <div className="bd"></div>
    </div>
  );
};

export default memo(Component);
