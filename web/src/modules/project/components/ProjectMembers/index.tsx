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
import { GetProjectRoleOptions, ProjectRoleLowerThan } from "@/const";
import { UserAPI } from "@/modules/user/api";
import { useEvent } from "@/utils/hooks";
import { ProjectAPI } from "../../api";
import styles from "./index.module.scss";

type MemberOption = ValueType & _User.IUser;

const UserFetchTitle = (
  <span className={`${styles.ProjectMembers}__fetch`}>
    <Search size={13} className="anticon" />
    <span> 用户搜索</span>
  </span>
);

export interface Props {
  projectId: string;
  myRoleScope: _Permission.ProjectAssignUserScope;
  myId: string;
}

const Component: FC<Props> = ({ projectId, myId, myRoleScope }) => {
  const members = useQuery(ProjectAPI.queryMemberList(projectId));
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
    mutationFn: ProjectAPI.updateMember,
    onSuccess: (_data, args) => {
      queryClient.setQueryData<_Project.IMember[]>([ProjectAPI.memberListQueryKey, projectId], (oldData) => {
        return oldData ? oldData.map((item) => (item.id === args.member.id ? Object.assign({}, item, args.member) : item)) : oldData;
      });
    },
  });

  const memberCreater = useMutation({
    mutationFn: ProjectAPI.createMember,
    onSuccess: (data, args) => {
      BaseWidgets.message.success("操作成功！");
      queryClient.setQueryData<_Project.IMember[]>([ProjectAPI.memberListQueryKey, projectId], (oldData) => {
        return oldData ? [data, ...oldData] : [data];
      });
    },
  });

  const memberDeleter = useMutation({
    mutationFn: ProjectAPI.deleteMemberItem,
    onSuccess: (data, args) => {
      queryClient.setQueryData<_Project.IMember[]>([ProjectAPI.memberListQueryKey, projectId], (oldData) => {
        return oldData ? oldData.filter((item) => item.id !== args.memberId) : oldData;
      });
    },
  });

  const onRoleChange = useEvent((memberId: string, projectRole: _Permission.ProjectRole) => {
    memberAlter.mutate({ projectId, member: { id: memberId, projectRole } });
  });

  const createMember = useEvent((_value: _User.IUser | undefined, selectedOption: MemberOption | undefined) => {
    if (selectedOption) {
      if (memberMaps[selectedOption.id]) {
        BaseWidgets.message.warning("该用户已在成员列表中！");
      } else {
        const { id, username, nickname } = selectedOption;
        memberCreater.mutate({ projectId, member: { id, username, nickname } });
      }
    }
  });

  const onUserFetch = useEvent(async (keyword: string) => {
    return UserAPI.getList({ keyword }).then((res) => {
      return res.list.map((item) => {
        const memberOption: MemberOption = { ...item, label: `${item.nickname} (${item.username})`, value: item.id };
        return memberOption;
      });
    });
  });

  const RoleOptions = useMemo(() => GetProjectRoleOptions(myRoleScope), [myRoleScope]);

  return (
    <div className={styles.ProjectMembers}>
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
          const readonly = isCurrent || !ProjectRoleLowerThan(myRoleScope, item.projectRole);
          return (
            <div key={item.id} className={classnames(`${styles.ProjectMembers}__item`, { cur: isCurrent })}>
              {!readonly && <CircleX className="remove" size={13} onClick={() => memberDeleter.mutate({ projectId, memberId: item.id })} />}
              <div className="label">
                <CircleUserRound className="avatar anticon" size={13} />
                <span className="nickname">{item.nickname}</span>
                <span className="username">{`(${item.username})`}</span>
              </div>
              {readonly ? (
                <Button className="role" size="small" type="link" style={{ color: "var(--bf-tx-lesser)" }} icon={<ChevronRight size={13} />}>
                  {item.projectRole}
                </Button>
              ) : (
                <Dropdown
                  trigger={["click"]}
                  menu={{
                    selectable: true,
                    defaultSelectedKeys: [item.projectRole],
                    items: RoleOptions,
                    onClick: ({ key, domEvent }: { key: string; domEvent: any }) => {
                      domEvent.stopPropagation();
                      if (key !== item.projectRole) {
                        onRoleChange(item.id, key as _Permission.ProjectRole);
                      }
                    },
                  }}
                >
                  <Button className="role" size="small" type="link" icon={<ChevronDown size={13} />}>
                    {item.projectRole}
                  </Button>
                </Dropdown>
              )}
              <Info className="info anticon" size={13} onClick={() => BaseWidgets.message.info(Lang.projectRolesTips, "500px")} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(Component);
