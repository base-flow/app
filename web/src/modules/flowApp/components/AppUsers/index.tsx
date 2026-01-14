import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { TransferProps } from "antd";
import { Skeleton, Transfer } from "antd";
import { UserRoundCheck, UserRoundSearch } from "lucide-react";
import type { FC } from "react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import FlagSelector from "@/components/FlagSelector";
import LoadingMask from "@/components/LoadingMask";
import SearchInput from "@/components/SearchInput";
import { UserAPI } from "@/modules/user/api";
import { FlowAppAPI } from "../../api";
import styles from "./index.module.scss";

const Titles = [
  <SearchInput variant="filled" width="220px" key="0" placeholder="搜索用户..." />,
  <div key="1" className={`${styles.AppUsers}__title success`}>
    <UserRoundCheck size={13} className="anticon" style={{ marginRight: "2px" }} />
    <span>已添加用户</span>
  </div>,
];
const Rowkey = (item: User.IUser) => item.id;
const SectionStyle = {
  section: {
    width: 420,
    height: 400,
  },
};

export interface Props {
  appId: string;
}

const AppUsers: FC<Props> = ({ appId }) => {
  const [userQuery, setUserQuery] = useState<User.IQuery>({});
  const users = useQuery(UserAPI.queryList(userQuery));
  const userList = users.data?.list;
  const userListSummary = users.data?.summary;
  const members = useQuery(FlowAppAPI.queryMemberList(appId));
  const memberList = members.data?.list;

  const [sourceList, targetIds] = useMemo(() => {
    const list: User.IUser[] = [];
    const exists: { [id: string]: boolean } = {};
    [...(memberList || []), ...(userList || [])].forEach((item) => {
      const id = item.id;
      if (!exists[id]) {
        exists[id] = true;
        list.push(item);
      } else {
        list.push({ ...item, id: `_${item.id}`, disabled: true });
      }
    });
    return [list, (memberList || []).map((item) => item.id)];
  }, [userList, memberList]);

  const queryClient = useQueryClient();

  const renderItem = (item: User.IUser) => {
    return {
      label: (
        <span className="custom-item">
          {item.id} - {item.username}
        </span>
      ),
      value: item.id,
    };
  };

  if (!userList || !memberList) {
    return (
      <div className={styles.AppUsers}>
        <Skeleton active />
      </div>
    );
  }

  return (
    <div className={styles.AppUsers}>
      <LoadingMask show={users.isFetching || members.isFetching} position="leftTop" />
      <Transfer
        styles={SectionStyle}
        rowKey={Rowkey}
        titles={Titles}
        dataSource={sourceList}
        targetKeys={targetIds}
        // onChange={handleChange}
        render={renderItem}
      />
    </div>
  );
};

export default memo(AppUsers);
