import { Input, Modal } from "antd";
import type { FC } from "react";
import { memo, useEffect, useRef, useState } from "react";
import IconEntity from "@/components/IconEntity";
import { useEvent } from "@/utils/hooks";
import { verifyFileName } from "@/utils/tools";
import styles from "./index.module.scss";

export type EntityRenameProps = {
  item: _Entity.IEntity;
  onSubmit: (id: string, name: string) => void;
  onCancel: () => void;
};

const Component: FC<EntityRenameProps> = ({ item, onCancel, onSubmit }) => {
  const inputRef = useRef<HTMLElement>(null);
  const [value, setValue] = useState(item.name);
  const [error, setError] = useState("");
  const _onSubmit = useEvent(() => {
    if (!error) {
      if (value !== item.name) {
        onSubmit(item.id, value);
      } else {
        onCancel();
      }
    }
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Modal open={true} width={400} title="重命名" onOk={_onSubmit} onCancel={onCancel}>
      <div className={styles.EntityRename}>
        <Input
          ref={inputRef as any}
          variant="filled"
          allowClear
          prefix={<IconEntity type={item.type} />}
          value={value}
          onChange={(e) => {
            const input = e.target.value.trim();
            setValue(input);
            setError(verifyFileName(input));
          }}
        />
        <div className="error">{error}</div>
      </div>
    </Modal>
  );
};

export default memo(Component);
