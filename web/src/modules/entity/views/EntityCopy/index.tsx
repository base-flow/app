import { BaseWidgets, produce } from "@baseflow/react";
import { StringSelect } from "@baseflow/widgets";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Tree } from "antd";
import type { FC } from "react";
import { memo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Lang, { formatLang } from "@/assets/Lang";
import IconEntity from "@/components/IconEntity";
import LoadingMask from "@/components/LoadingMask";
import { useAppStore } from "@/modules/app/store";
import { useConfig, useEvent } from "@/utils/hooks";
import { findInTree, showPath } from "@/utils/tools";
import { EntityAPI } from "../../api";
import styles from "./index.module.scss";

interface TreeData {
  key: string;
  title: string;
  path: string;
  children?: TreeData[];
}
const ActionOptions = [
  { value: "move", label: "移动到" },
  { value: "copy", label: "复制到" },
];

const ActionMaps = ActionOptions.reduce(
  (obj, cur) => {
    obj[cur.value] = cur.label;
    return obj;
  },
  {} as { [key: string]: string },
);

const DirIcon = <IconEntity type="directory" />;

const updateTreeData = (list: TreeData[], key: React.Key, children: TreeData[]): TreeData[] =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });

export type EntityCopyProps = {
  file?: string;
  ids: string[];
  onSuccess: () => void;
  onCancel: () => void;
};

const Component: FC<EntityCopyProps> = ({ file, ids, onCancel, onSuccess }) => {
  const subject = file ? formatLang(Lang.letSingleFiles, { name: file }) : formatLang(Lang.letMultipleFiles, { count: `${ids.length}` });
  const queryClient = useQueryClient();
  const { auth } = useConfig();
  const [myProjects] = useAppStore(useShallow(({ myProjects }) => [myProjects]));
  const [action, setAction] = useState<"move" | "copy">("move");
  const [selected, setSelected] = useState<TreeData>();
  const [treeData, setTreeData] = useState<TreeData[]>(() => [
    { title: "我的文档", key: auth.dir, path: `/${auth.username}` },
    ...Object.keys(myProjects)
      .filter((id) => {
        const projectRole = myProjects[id].projectRole;
        return projectRole === "Owner" || projectRole === "Admin" || projectRole === "Developer";
      })
      .map((id) => {
        const item = myProjects[id];
        return { title: item.projectName, key: item.projectDir, path: `/${item.projectName}` };
      }),
  ]);

  const onLoadData = useEvent(({ key, children }: TreeData) => {
    if (children) {
      return Promise.resolve();
    }
    return queryClient.fetchQuery(EntityAPI.queryList({ dir: key, type: "directory" })).then((data) => {
      const children = data.list.map((item) => ({ title: item.name, key: item.id, path: showPath(item.path, true) }));
      const newTreeData = produce(treeData, (draft) => {
        for (let i = 0, k = draft.length; i < k; i++) {
          const dir = findInTree(draft[i], (item) => {
            if (item.key === key) {
              return item;
            }
          });
          if (dir) {
            dir.children = children;
            return;
          }
        }
      });
      setTreeData(newTreeData);
    });
  });

  const onSelect = useEvent((_selectedKeys: string[], info: { selectedNodes: TreeData[] }) => {
    setSelected(info.selectedNodes[0]);
  });

  const entityCopyer = useMutation({
    mutationFn: EntityAPI.batchMove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey] });
      onSuccess();
    },
  });

  const onSubmit = useEvent(() => {
    BaseWidgets.confirm(
      formatLang(Lang.copyConfirm, {
        file: subject,
        action: ActionMaps[action],
        path: selected!.path,
      }),
      (ok) => {
        if (ok) {
          entityCopyer.mutate({ ids, target: selected!.key, action });
        }
      },
    );
  });

  return (
    <Modal open={true} width={600} title="移动/复制" onCancel={onCancel} footer={null}>
      <div className={styles.EntityCopy}>
        <LoadingMask show={entityCopyer.isPending} />
        <div className="hd">
          <div className="subject">{subject}</div>
          <StringSelect variant="filled" block value={action} options={ActionOptions} onChange={setAction as any} />
        </div>
        <div className="bd">
          <Tree showLine showIcon virtual={false} icon={DirIcon} loadData={onLoadData} treeData={treeData} onSelect={onSelect as any} />
        </div>
        <div className="g-form-footer">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" disabled={!selected} onClick={onSubmit}>
            {ActionMaps[action]}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(Component);
