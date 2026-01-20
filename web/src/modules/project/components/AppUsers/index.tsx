import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown } from "antd";
import classnames from "classnames";
import { ChevronDown, ChevronRight, CircleUserRound, CircleX, Info, Search } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo } from "react";
import Lang from "@/assets/Lang";
import type { ValueType } from "@/components/FetchSelect";
import FetchSelect from "@/components/FetchSelect";
import LoadingMask from "@/components/LoadingMask";
import { AppRoleLower, GetAppRoleOptions } from "@/const";
import { UserAPI } from "@/modules/user/api";
import { useEvent } from "@/utils/hooks";
import { FlowAppAPI } from "../../api";
import styles from "./index.module.scss";

type UserOption = ValueType & User.IUser;

const UserFetchTitle = (
  <span className={`${styles.AppUsers}__fetch`}>
    <Search size={13} className="anticon" />
    <span> 用户搜索</span>
  </span>
);

export interface Props {
  appId: string;
  myRoleScope: App.AppAssignUserScope;
  myId: string;
}

const AppUsers: FC<Props> = ({ appId, myId, myRoleScope }) => {
  const members = useQuery(FlowAppAPI.queryMemberList(appId));
  const memberList = members.data;
  const memberMaps = useMemo(
    () =>
      (memberList || []).reduce(
        (obj, cur) => {
          obj[cur.id] = true;
          return obj;
        },
        {} as { [id: string]: boolean },
      ),
    [memberList],
  );

  const queryClient = useQueryClient();

  const memberAlter = useMutation({
    mutationFn: FlowAppAPI.updateMember,
    onSuccess: (data, args) => {
      queryClient.setQueryData<FlowApp.IMemberQueryResult>([FlowAppAPI.memberListQueryKey, appId], (oldData) => {
        return oldData ? oldData.map((item) => (item.id === args.member.id ? Object.assign({}, item, args.member) : item)) : oldData;
      });
    },
  });

  const memberCreater = useMutation({
    mutationFn: FlowAppAPI.createMember,
    onSuccess: (data, args) => {
      BaseWidgets.message.success("操作成功！");
      queryClient.setQueryData<FlowApp.IMemberQueryResult>([FlowAppAPI.memberListQueryKey, appId], (oldData) => {
        return oldData ? [data, ...oldData] : [data];
      });
    },
  });

  const memberDeleter = useMutation({
    mutationFn: FlowAppAPI.deleteMemberItem,
    onSuccess: (data, args) => {
      queryClient.setQueryData<FlowApp.IMemberQueryResult>([FlowAppAPI.memberListQueryKey, appId], (oldData) => {
        return oldData ? oldData.filter((item) => item.id !== args.memberId) : oldData;
      });
    },
  });

  const onRoleChange = useEvent((memberId: string, appRole: FlowApp.AppRole) => {
    memberAlter.mutate({ appId, member: { id: memberId, appRole } });
  });

  const createMember = useEvent((value: User.IUser | undefined, member: UserOption | undefined) => {
    if (member) {
      if (memberMaps[member.id]) {
        BaseWidgets.message.warning("该用户已在成员列表中！");
      } else {
        const { id, username, nickname } = member;
        memberCreater.mutate({ appId, member: { id, username, nickname } });
      }
    }
  });

  const onUserFetch = useEvent(async (keyword: string) => {
    return UserAPI.getList({ keyword }).then((res) => {
      return res.list.map((item) => {
        const userOption: UserOption = { ...item, label: `${item.nickname} (${item.username})`, value: item.id };
        return userOption;
      });
    });
  });

  const RoleOptions = useMemo(() => GetAppRoleOptions(myRoleScope), [myRoleScope]);

  return (
    <div className={styles.AppUsers}>
      <LoadingMask show={members.isFetching} />
      <div className="hd">
        <FetchSelect
          className="fetch-user"
          variant="filled"
          prefix={UserFetchTitle}
          allowClear
          fetchOptions={onUserFetch}
          onChange={createMember as any}
        />
        <div className="count">已添加成员: {memberList?.length}</div>
      </div>
      <div className="bd">
        {(memberList || []).map((item) => {
          const isCurrent = item.id === myId;
          const readonly = isCurrent || !AppRoleLower(myRoleScope, item.appRole);
          return (
            <div key={item.id} className={classnames(`${styles.AppUsers}__item`, { cur: isCurrent })}>
              {!readonly && <CircleX className="remove" size={13} onClick={() => memberDeleter.mutate({ appId: appId, memberId: item.id })} />}
              <div className="label">
                <CircleUserRound className="avatar anticon" size={13} />
                <span className="nickname">{item.nickname}</span>
                <span className="username">{`(${item.username})`}</span>
              </div>
              {readonly ? (
                <Button className="role" size="small" type="link" style={{ color: "var(--bf-tx-lesser)" }} icon={<ChevronRight size={13} />}>
                  {item.appRole}
                </Button>
              ) : (
                <Dropdown
                  trigger={["click"]}
                  menu={{
                    selectable: true,
                    defaultSelectedKeys: [item.appRole],
                    items: RoleOptions,
                    onClick: ({ key, domEvent }: { key: string; domEvent: any }) => {
                      domEvent.stopPropagation();
                      if (key !== item.appRole) {
                        onRoleChange(item.id, key as FlowApp.AppRole);
                      }
                    },
                  }}
                >
                  <Button className="role" size="small" type="link" icon={<ChevronDown size={13} />}>
                    {item.appRole}
                  </Button>
                </Dropdown>
              )}
              <Info className="info anticon" size={13} onClick={() => BaseWidgets.message.info(Lang.appRolesTips, "500px")} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(AppUsers);
