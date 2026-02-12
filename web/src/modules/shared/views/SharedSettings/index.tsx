import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LinkProps } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { Link2Off, Settings } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo, useState } from "react";
import LinkNav from "@/components/LinkNav";
import LoadingMask from "@/components/LoadingMask";
import SharedEdit from "@/modules/shared/views/SharedEdit";
import { useEvent } from "@/utils/hooks";
import { SharedAPI } from "../../api";

const Component: FC<{ shared: _Shared.IShared }> = ({ shared }) => {
  const [edit, setEdit] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const sharedDeleter = useMutation({
    mutationFn: SharedAPI.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SharedAPI.listQueryKey] });
      navigate({ to: `/${shared.spaceType}/${shared.spaceId}/shared` });
    },
  });

  const settingsItems = useMemo(() => {
    const list: LinkProps[] = [];
    list.push(
      {
        href: "update",
        children: (
          <>
            <Settings size={13} />
            <span>修改设置</span>
          </>
        ),
      },
      {
        href: "delete",
        children: (
          <>
            <Link2Off size={13} />
            <span>取消分享</span>
          </>
        ),
      },
    );
    return list;
  }, []);

  const onConfigItemClick = useEvent((item: LinkProps) => {
    if (item.href === "update") {
      setEdit(true);
    } else if (item.href === "delete") {
      BaseWidgets.confirm(`确定要取消这个分享吗？`, (ok) => {
        if (ok) {
          sharedDeleter.mutate(shared.id);
        }
      });
    }
  });

  const closeEdit = useEvent(() => setEdit(false));

  return (
    <div className="g-settings">
      <LoadingMask show={sharedDeleter.isPending} />
      <div className="title">
        <span>管理</span>
      </div>
      <LinkNav links={settingsItems} size="small" onClick={onConfigItemClick} />
      {edit && <SharedEdit item={shared} onCancel={closeEdit} onSuccess={closeEdit} />}
    </div>
  );
};

export default memo(Component);
