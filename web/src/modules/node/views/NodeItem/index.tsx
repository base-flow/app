import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBlocker } from "@tanstack/react-router";
import type { MenuProps } from "antd";
import { Button, Dropdown } from "antd";
import { PlusCircle, Tag } from "lucide-react";
import type { FC } from "react";
import { memo, useEffect, useState } from "react";
import LoadingMask from "@/components/LoadingMask";
import { useEvent } from "@/utils/hooks";
import { NodeAPI } from "../../api";
import Header from "./Header";
import styles from "./index.module.scss";

const items: MenuProps["items"] = [
  {
    key: "2",
    className: "btn",
    label: "创建新版本",
    icon: <PlusCircle size={13} />,
  },
  {
    key: "1",
    className: "btn pub",
    label: "发布正式版",
    icon: <PlusCircle size={13} />,
    extra: "v0.0.1",
  },
  {
    key: "2",
    type: "divider",
  },
  {
    key: "v1.0.1-dev",
    label: "v1.0.1-dev",
    icon: <Tag size={13} />,
  },
  {
    key: "4",
    label: "v1.0.2-dev",
    icon: <Tag size={13} />,
  },
  {
    key: "5",
    label: "v1.0.3",
    icon: <Tag size={13} />,
  },
];
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

  const [versionsMenu, setVersionsMenu] = useState(() => ({
    items,
    selectedKeys: ["v1.0.1-dev"],
    className: `${styles.NodeItemHeader}__ver-menu`,
    offset: [15, 12],
  }));

  const nodeUpdater = useMutation({
    mutationFn: NodeAPI.updateItem,
    onSuccess: () => {
      BaseWidgets.message.success("修改成功！");
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
      <LoadingMask show={false} />
      <Header item={item}>
        <Button onClick={() => window.MonacoEditor.format()}>格式化</Button>
        <Button type="primary" loading={nodeUpdater.isPending} disabled={content === item.content} onClick={onSave}>
          保存
        </Button>
        <Dropdown menu={versionsMenu} align={versionsMenu}>
          <Button type="text" size="small" icon={<Tag size={12} />}>
            v0.0.1-dev
          </Button>
        </Dropdown>
      </Header>
      <div className="bd"></div>
    </div>
  );
};

export default memo(Component);
