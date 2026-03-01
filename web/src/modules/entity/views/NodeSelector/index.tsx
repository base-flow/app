import { Dropdown } from "antd";
import classnames from "classnames";
import { ChevronDown, ClipboardPlus, LayoutGrid, Share2, Star, UserRoundPen, Wifi } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Lang from "@/assets/Lang";
import LoadingMask from "@/components/LoadingMask";
import { useAppStore } from "@/modules/app/store";
import { useConfig, useEvent, useMyFavoriteList } from "@/utils/hooks";
import CardList from "./CardList";
import styles from "./index.module.scss";

type Cate = "personal" | "project" | "platform" | "shared" | "favorite";

interface NodeSelectorProps {
  kind: _Node.Kind;
  runtime: _App.Runtime;
  //onSubmit: (item: { type: string; dsl: string }) => void;
}

const Component: FC<NodeSelectorProps> = ({ kind, runtime }) => {
  const [myProjects] = useAppStore(useShallow(({ myProjects }) => [myProjects]));
  const { favoriteQuery, onFavoriteChange } = useMyFavoriteList();
  const favoriteList = useMemo(() => {
    return favoriteQuery.data?.filter((item) => item.type === "node");
  }, [favoriteQuery.data]);
  const favoriteMap = useMemo(() => {
    if (favoriteList) {
      return favoriteList.reduce(
        (obj, item) => {
          obj[item.id] = true;
          return obj;
        },
        {} as { [id: string]: boolean },
      );
    } else {
      return {};
    }
  }, [favoriteList]);

  const { config, auth } = useConfig();
  const [cateData, setCateData] = useState(() => ({
    cate: "platform" as Cate,
    sub: "",
    rootDir: config.platformDirs.node[runtime],
    rootName: Lang.runtime[runtime],
  }));

  const onCateClick = useEvent((cate: Cate, sub: string = "") => {
    if (cateData.cate === cate && cateData.sub === sub) {
      return;
    }
    if (cate === "platform") {
      setCateData({
        cate,
        sub,
        rootDir: config.platformDirs.node[runtime],
        rootName: Lang.runtime[runtime],
      });
      setMyProjectMenu(myProjectOptions);
    } else if (cate === "personal") {
      setCateData({
        cate,
        sub,
        rootDir: auth.dir,
        rootName: "我的文档",
      });
      setMyProjectMenu(myProjectOptions);
    } else if (cate === "project") {
      const project = myProjects[sub];
      setCateData({
        cate,
        sub,
        rootDir: project.projectDir,
        rootName: project.projectName,
      });
      setMyProjectMenu({ ...myProjectOptions, selectedKeys: [sub] });
    } else if (cate === "favorite") {
    }
  });

  const myProjectOptions = useMemo(
    () => ({
      items: Object.keys(myProjects).map((id) => {
        const { projectName } = myProjects[id];
        return { label: projectName, key: id };
      }),
      selectedKeys: [] as string[],
      offset: [0, 0],
      onClick: (e: { key: string }) => onCateClick("project", e.key),
    }),
    [myProjects, onCateClick],
  );

  const [myProjectMenu, setMyProjectMenu] = useState(myProjectOptions);

  return (
    <div className={styles.NodeSelector}>
      <LoadingMask show={favoriteQuery.isFetching} />
      <div className="cate">
        <span className={classnames({ on: cateData.cate === "personal" })} onClick={() => onCateClick("personal")}>
          <UserRoundPen size={13} strokeWidth={2.5} className="g-vertical" />
          <span style={{ marginLeft: "3px" }}>我的文档</span>
        </span>
        <Dropdown menu={myProjectMenu} placement="bottomCenter" align={myProjectMenu}>
          <span className={classnames({ on: cateData.cate === "project" })}>
            <LayoutGrid size={13} strokeWidth={2.5} className="g-vertical" />
            <span style={{ marginLeft: "3px" }}>我的项目</span>
            <ChevronDown size={13} strokeWidth={2.5} className="g-vertical" />
          </span>
        </Dropdown>
        <span className={classnames({ on: cateData.cate === "platform" })} onClick={() => onCateClick("platform")}>
          <Wifi size={13} strokeWidth={2.5} className="g-vertical" />
          <span style={{ marginLeft: "3px" }}>公共平台</span>
        </span>
        <span className={classnames({ on: cateData.cate === "shared" })}>
          <Share2 size={13} strokeWidth={2.5} className="g-vertical" />
          <span style={{ marginLeft: "3px" }}>他人分享</span>
        </span>
        <span className={classnames({ on: cateData.cate === "favorite" })} onClick={() => onCateClick("favorite")}>
          <Star size={13} strokeWidth={2.5} className="g-vertical" />
          <span style={{ marginLeft: "3px" }}>我的收藏</span>
        </span>
      </div>
      <div className="clipboard">
        <ClipboardPlus size="13" className="g-vertical" />
        <span>从剪贴板粘贴</span>
      </div>
      <CardList
        key={cateData.rootDir}
        kind={kind}
        runtime={runtime}
        rootDir={cateData.rootDir}
        rootName={cateData.rootName}
        favoriteMap={favoriteMap}
        onFavoriteChange={onFavoriteChange}
      />
    </div>
  );
};

export default memo(Component);
