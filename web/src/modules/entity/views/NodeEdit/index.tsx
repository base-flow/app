import { BaseWidgets } from "@baseflow/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Select } from "antd";
import { FilePenLine, Plus } from "lucide-react";
import type { FC } from "react";
import { memo, useMemo, useState } from "react";
import LoadingMask from "@/components/LoadingMask";
import { FileNameRule, RequiredRule, RuntimeOptions } from "@/const";
import { NodeAPI } from "@/modules/node/api";
import { useEntityNavigate, useEvent } from "@/utils/hooks";
import { verifyFileName } from "@/utils/tools";
import { EntityAPI } from "../../api";
import styles from "./index.module.scss";
import Kind from "./Kind";

const DefaultNodeIcon =
  "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOTQuMjM4IDI5NC4yMzkiIHdpZHRoPSIyOTQuMjM4cHgiIGhlaWdodD0iMjk0LjIzOXB4Ij48cGF0aCBkPSJNIDI4Mi40NjggMCBMIDExLjc3IDAgQyA1LjI1OSAwIDAgNS4yNTkgMCAxMS43NjkgTCAwIDI4Mi40NjkgQyAwIDI4OC45OCA1LjI1OSAyOTQuMjM5IDExLjc3IDI5NC4yMzkgTCAyODIuNDY4IDI5NC4yMzkgQyAyODguOTc4IDI5NC4yMzkgMjk0LjIzOCAyODguOTggMjk0LjIzOCAyODIuNDY5IEwgMjk0LjIzOCAxMS43NjkgQyAyOTQuMjM4IDUuMjU5IDI4OC45NzggMCAyODIuNDY4IDAgWiBNIDEwNy4zOTcgMjEwLjAxMyBMIDEwNy4zOTcgMjM4LjMzNCBDIDEwNy4zOTcgMjM5Ljk1MiAxMDYuMDczIDI0MS4yNzYgMTA0LjQ1NCAyNDEuMjc2IEwgODYuOCAyNDEuMjc2IEMgODUuMTgyIDI0MS4yNzYgODMuODU4IDIzOS45NTIgODMuODU4IDIzOC4zMzQgTCA4My44NTggMjEwLjAxMyBDIDY4LjUyMSAyMDUuMDExIDU3LjM3NiAxOTAuNTk0IDU3LjM3NiAxNzMuNjAyIEMgNTcuMzc2IDE1Ni42MDkgNjguNTIxIDE0Mi4xNTUgODMuODU4IDEzNy4xOSBMIDgzLjg1OCA1NS45MDcgQyA4My44NTggNTQuMjg4IDg1LjE4MiA1Mi45NjQgODYuOCA1Mi45NjQgTCAxMDQuNDU0IDUyLjk2NCBDIDEwNi4wNzMgNTIuOTY0IDEwNy4zOTcgNTQuMjg4IDEwNy4zOTcgNTUuOTA3IEwgMTA3LjM5NyAxMzcuMTkgQyAxMjIuNzM0IDE0Mi4xOTIgMTMzLjg3OCAxNTYuNjA5IDEzMy44NzggMTczLjYwMiBDIDEzMy44NzggMTkwLjU5NCAxMjIuNzM0IDIwNS4wNDggMTA3LjM5NyAyMTAuMDEzIFogTSAyMTAuMjMzIDE1Ny4wODggQyAyMTAuMzA2IDE1Ny4wODggMjEwLjM0MyAxNTcuMDUxIDIxMC4zOCAxNTcuMDUxIEwgMjEwLjM4IDIzOC4zMzQgQyAyMTAuMzggMjM5Ljk1MiAyMDkuMDU2IDI0MS4yNzYgMjA3LjQzNyAyNDEuMjc2IEwgMTg5Ljc4MyAyNDEuMjc2IEMgMTg4LjE2NSAyNDEuMjc2IDE4Ni44NDEgMjM5Ljk1MiAxODYuODQxIDIzOC4zMzQgTCAxODYuODQxIDE1Ny4wNTEgQyAxODYuOTE0IDE1Ny4wNTEgMTg2Ljk1MSAxNTcuMDg4IDE4Ni45ODggMTU3LjA4OCBDIDE3MS41NDEgMTUyLjE1OSAxNjAuMzU5IDEzNy43MDUgMTYwLjM1OSAxMjAuNjM5IEMgMTYwLjM1OSAxMDMuNTczIDE3MS41NDEgODkuMTE5IDE4Ni45ODggODQuMTkgQyAxODYuOTE0IDg0LjE5IDE4Ni44NzggODQuMjI3IDE4Ni44NDEgODQuMjI3IEwgMTg2Ljg0MSA1NS45MDcgQyAxODYuODQxIDU0LjI4OCAxODguMTY1IDUyLjk2NCAxODkuNzgzIDUyLjk2NCBMIDIwNy40MzcgNTIuOTY0IEMgMjA5LjA1NiA1Mi45NjQgMjEwLjM4IDU0LjI4OCAyMTAuMzggNTUuOTA3IEwgMjEwLjM4IDg0LjIyNyBDIDIxMC4zMDYgODQuMjI3IDIxMC4yNyA4NC4xOSAyMTAuMjMzIDg0LjE5IEMgMjI1LjY4IDg5LjExOSAyMzYuODYxIDEwMy41NzMgMjM2Ljg2MSAxMjAuNjM5IEMgMjM2Ljg2MSAxMzcuNzA1IDIyNS42OCAxNTIuMTU5IDIxMC4yMzMgMTU3LjA4OCBaIE0gMTg1LjM3IDEyMC42MzkgQyAxODUuMzcgMTMwLjgzMiAxOTYuNDA0IDEzNy4yMDIgMjA1LjIzMSAxMzIuMTA2IEMgMjA5LjMyOCAxMjkuNzQgMjExLjg1MSAxMjUuMzY5IDIxMS44NTEgMTIwLjYzOSBDIDIxMS44NTEgMTEwLjQ0NiAyMDAuODE3IDEwNC4wNzYgMTkxLjk5IDEwOS4xNzIgQyAxODcuODkzIDExMS41MzcgMTg1LjM3IDExNS45MDkgMTg1LjM3IDEyMC42MzkgWiBNIDEwNy4xNzYgMTY3LjE2NSBMIDEwNi42MjQgMTY2LjI4MiBDIDEwNi42MjQgMTY2LjI0NiAxMDYuNTg4IDE2Ni4yNDYgMTA2LjU4OCAxNjYuMjA5IEwgMTA2LjI1NyAxNjUuNzY4IEMgMTA2LjIyIDE2NS43MzEgMTA2LjE4MyAxNjUuNjk0IDEwNi4xODMgMTY1LjY1NyBDIDEwNS44MTUgMTY1LjE3OSAxMDUuNDQ3IDE2NC43MzggMTA1LjAwNiAxNjQuMzMzIEwgMTA0LjkzMiAxNjQuMjYgQyAxMDQuNzg1IDE2NC4xMTIgMTA0LjYzOCAxNjMuOTY1IDEwNC40OTEgMTYzLjg1NSBDIDEwNC4xOTcgMTYzLjU2MSAxMDMuODY2IDE2My4zMDMgMTAzLjUzNSAxNjMuMDgzIEwgMTAzLjQ5OCAxNjMuMDgzIEwgMTAzLjA1NyAxNjIuNzUyIEMgMTAzLjAyIDE2Mi43MTUgMTAyLjk0NiAxNjIuNjc4IDEwMi45MSAxNjIuNjQxIEMgMTAyLjQ2OCAxNjIuMzQ3IDEwMS45OSAxNjIuMDUzIDEwMS40NzUgMTYxLjgzMiBDIDEwMS40MDIgMTYxLjc5NSAxMDEuMjkxIDE2MS43NTkgMTAxLjIxOCAxNjEuNjg1IEMgMTAxLjA3MSAxNjEuNjExIDEwMC45NiAxNjEuNTc1IDEwMC44MTMgMTYxLjUwMSBDIDEwMC43MDMgMTYxLjQ2NCAxMDAuNTU2IDE2MS4zOTEgMTAwLjQ0NSAxNjEuMzU0IEMgMTAwLjI2MSAxNjEuMjggMTAwLjA3OCAxNjEuMjA3IDk5Ljg5NCAxNjEuMTcgQyA5OS43NDcgMTYxLjEzMyA5OS41NjMgMTYxLjA2IDk5LjQxNiAxNjEuMDIzIEwgOTkuMDg1IDE2MC45MTMgTCA5OC41NyAxNjAuODAyIEMgOTguNDk2IDE2MC43NjUgOTguMzg2IDE2MC43NjUgOTguMzEyIDE2MC43MjkgQyA5OC4wNTUgMTYwLjY5MiA5Ny43OTcgMTYwLjYxOCA5Ny41NCAxNjAuNTgyIEMgOTcuNDY2IDE2MC41ODIgOTcuMzkzIDE2MC41ODIgOTcuMzE5IDE2MC41NDUgQyA5Ny4wOTggMTYwLjUwOCA5Ni45MTQgMTYwLjUwOCA5Ni42OTQgMTYwLjQ3MSBDIDk2LjYyIDE2MC40NzEgOTYuNTQ3IDE2MC40NzEgOTYuNDM2IDE2MC40MzQgQyA5Ni4xNDIgMTYwLjQzNCA5NS44ODUgMTYwLjM5OCA5NS41OSAxNjAuMzk4IEMgOTUuMjk2IDE2MC4zOTggOTUuMDM5IDE2MC4zOTggOTQuNzQ0IDE2MC40MzQgQyA5NC42NzEgMTYwLjQzNCA5NC41OTcgMTYwLjQzNCA5NC40ODcgMTYwLjQ3MSBDIDk0LjI2NiAxNjAuNDcxIDk0LjA0NiAxNjAuNTA4IDkzLjg2MiAxNjAuNTQ1IEMgOTMuNzg4IDE2MC41NDUgOTMuNzE1IDE2MC41NDUgOTMuNjQxIDE2MC41ODIgQyA5My4zODQgMTYwLjYxOCA5My4xMjYgMTYwLjY1NSA5Mi44NjkgMTYwLjcyOSBDIDkyLjc5NSAxNjAuNzY1IDkyLjY4NSAxNjAuNzY1IDkyLjYxMSAxNjAuODAyIEwgOTIuMDk2IDE2MC45MTMgTCA5MS43NjUgMTYxLjAyMyBDIDkxLjYxOCAxNjEuMDYgOTEuNDM0IDE2MS4xMzMgOTEuMjg3IDE2MS4xNyBDIDkxLjEwMyAxNjEuMjQ0IDkwLjkxOSAxNjEuMzE3IDkwLjczNiAxNjEuMzU0IEMgOTAuNjI1IDE2MS4zOTEgOTAuNDc4IDE2MS40NjQgOTAuMzY4IDE2MS41MDEgQyA5MC4yMjEgMTYxLjU3NSA5MC4xMSAxNjEuNjExIDg5Ljk2MyAxNjEuNjg1IEMgODkuODkgMTYxLjcyMiA4OS43NzkgMTYxLjc1OSA4OS43MDYgMTYxLjgzMiBDIDg5LjIyOCAxNjIuMDkgODguNzQ5IDE2Mi4zNDcgODguMjcxIDE2Mi42NDEgQyA4OC4yMzQgMTYyLjY3OCA4OC4xNjEgMTYyLjcxNSA4OC4xMjQgMTYyLjc1MiBMIDg3LjY4MyAxNjMuMDgzIEwgODcuNjQ2IDE2My4wODMgQyA4Ny4zMTUgMTYzLjM0IDg2Ljk4NCAxNjMuNTk4IDg2LjY5IDE2My44NTUgQyA4Ni41NDMgMTY0LjAwMiA4Ni4zOTYgMTY0LjExMiA4Ni4yNDggMTY0LjI2IEwgODYuMTc1IDE2NC4zMzMgQyA4NS43NjMgMTY0Ljc1NyA4NS4zNzEgMTY1LjE5OSA4NC45OTggMTY1LjY1NyBDIDg0Ljk2MSAxNjUuNjk0IDg0LjkyNCAxNjUuNzMxIDg0LjkyNCAxNjUuNzY4IEwgODQuNTkzIDE2Ni4yMDkgQyA4NC41OTMgMTY2LjI0NiA4NC41NTcgMTY2LjI0NiA4NC41NTcgMTY2LjI4MiBMIDg0LjAwNSAxNjcuMTY1IEMgODMuOTY4IDE2Ny4yMzkgODMuOTMxIDE2Ny4yNzUgODMuODk0IDE2Ny4zNDkgQyA4Mi45MDEgMTY5LjIyNSA4Mi4zMTMgMTcxLjM1OCA4Mi4zMTMgMTczLjYwMiBDIDgyLjMxMyAxNzUuODQ1IDgyLjkwMSAxNzguMDE1IDgzLjg5NCAxNzkuODU0IEMgODMuOTMxIDE3OS45MjggODMuOTY4IDE3OS45NjQgODQuMDA1IDE4MC4wMzggTCA4NC41NTcgMTgwLjkyMSBDIDg0LjU1NyAxODAuOTU4IDg0LjU5MyAxODAuOTU4IDg0LjU5MyAxODAuOTk0IEwgODQuOTI0IDE4MS40MzYgQyA4NC45NjEgMTgxLjQ3MiA4NC45OTggMTgxLjUwOSA4NC45OTggMTgxLjU0NiBDIDg1LjM2NiAxODIuMDI0IDg1LjczMyAxODIuNDY2IDg2LjE3NSAxODIuODcgTCA4Ni4yNDggMTgyLjk0NCBDIDg2LjM5NiAxODMuMDkxIDg2LjU0MyAxODMuMjM4IDg2LjY5IDE4My4zNDggQyA4Ni45ODQgMTgzLjY0MiA4Ny4zMTUgMTgzLjkgODcuNjQ2IDE4NC4xMjEgTCA4Ny42ODMgMTg0LjEyMSBMIDg4LjEyNCAxODQuNDUyIEMgODguMTYxIDE4NC40ODggODguMjM0IDE4NC41MjUgODguMjcxIDE4NC41NjIgQyA4OC43MTMgMTg0Ljg1NiA4OS4xOTEgMTg1LjE1IDg5LjcwNiAxODUuMzcxIEMgODkuNzc5IDE4NS40MDggODkuODkgMTg1LjQ0NSA4OS45NjMgMTg1LjUxOCBDIDkwLjExIDE4NS41OTIgOTAuMjIxIDE4NS42MjkgOTAuMzY4IDE4NS43MDIgQyA5MC40NzggMTg1LjczOSA5MC42MjUgMTg1LjgxMiA5MC43MzYgMTg1Ljg0OSBDIDkwLjkxOSAxODUuOTIzIDkxLjEwMyAxODUuOTk2IDkxLjI4NyAxODYuMDMzIEMgOTEuNDM0IDE4Ni4wNyA5MS42MTggMTg2LjE0MyA5MS43NjUgMTg2LjE4IEwgOTIuMDk2IDE4Ni4yOTEgTCA5Mi42MTEgMTg2LjQwMSBDIDkyLjY4NSAxODYuNDM4IDkyLjc5NSAxODYuNDM4IDkyLjg2OSAxODYuNDc0IEMgOTMuMTI2IDE4Ni41MTEgOTMuMzg0IDE4Ni41ODUgOTMuNjQxIDE4Ni42MjIgQyA5My43MTUgMTg2LjYyMiA5My43ODggMTg2LjYyMiA5My44NjIgMTg2LjY1OCBDIDk0LjA4MiAxODYuNjk1IDk0LjI2NiAxODYuNjk1IDk0LjQ4NyAxODYuNzMyIEMgOTQuNTYxIDE4Ni43MzIgOTQuNjM0IDE4Ni43MzIgOTQuNzQ0IDE4Ni43NjkgQyA5NS4wMzkgMTg2Ljc2OSA5NS4yOTYgMTg2LjgwNiA5NS41OSAxODYuODA2IEMgOTUuODg1IDE4Ni44MDYgOTYuMTQyIDE4Ni44MDYgOTYuNDM2IDE4Ni43NjkgQyA5Ni41MSAxODYuNzY5IDk2LjU4MyAxODYuNzY5IDk2LjY5NCAxODYuNzMyIEMgOTYuOTE0IDE4Ni43MzIgOTcuMTM1IDE4Ni42OTUgOTcuMzE5IDE4Ni42NTggQyA5Ny4zOTMgMTg2LjY1OCA5Ny40NjYgMTg2LjY1OCA5Ny41NCAxODYuNjIyIEMgOTcuNzk3IDE4Ni41ODUgOTguMDU1IDE4Ni41NDggOTguMzEyIDE4Ni40NzQgQyA5OC4zODYgMTg2LjQzOCA5OC40OTYgMTg2LjQzOCA5OC41NyAxODYuNDAxIEwgOTkuMDg1IDE4Ni4yOTEgTCA5OS40MTYgMTg2LjE4IEMgOTkuNTYzIDE4Ni4xNDMgOTkuNzQ3IDE4Ni4wNyA5OS44OTQgMTg2LjAzMyBDIDEwMC4wNzggMTg1Ljk2IDEwMC4yNjEgMTg1Ljg4NiAxMDAuNDQ1IDE4NS44NDkgQyAxMDAuNTU2IDE4NS44MTIgMTAwLjcwMyAxODUuNzM5IDEwMC44MTMgMTg1LjcwMiBDIDEwMC45NiAxODUuNjI5IDEwMS4wNzEgMTg1LjU5MiAxMDEuMjE4IDE4NS41MTggQyAxMDEuMjkxIDE4NS40ODEgMTAxLjQwMiAxODUuNDQ1IDEwMS40NzUgMTg1LjM3MSBDIDEwMS45NTMgMTg1LjExNCAxMDIuNDMxIDE4NC44NTYgMTAyLjkxIDE4NC41NjIgQyAxMDIuOTQ2IDE4NC41MjUgMTAzLjAyIDE4NC40ODggMTAzLjA1NyAxODQuNDUyIEwgMTAzLjQ5OCAxODQuMTIxIEwgMTAzLjUzNSAxODQuMTIxIEMgMTAzLjg2NiAxODMuODYzIDEwNC4xOTcgMTgzLjYwNiAxMDQuNDkxIDE4My4zNDggQyAxMDQuNjM4IDE4My4yMDEgMTA0Ljc4NSAxODMuMDkxIDEwNC45MzIgMTgyLjk0NCBMIDEwNS4wMDYgMTgyLjg3IEMgMTA1LjQxMSAxODIuNDY2IDEwNS44MTUgMTgxLjk4NyAxMDYuMTgzIDE4MS41NDYgQyAxMDYuMjIgMTgxLjUwOSAxMDYuMjU3IDE4MS40NzIgMTA2LjI1NyAxODEuNDM2IEwgMTA2LjU4OCAxODAuOTk0IEMgMTA2LjU4OCAxODAuOTU4IDEwNi42MjQgMTgwLjk1OCAxMDYuNjI0IDE4MC45MjEgTCAxMDcuMTc2IDE4MC4wMzggQyAxMDcuMjEzIDE3OS45NjQgMTA3LjI1IDE3OS45MjggMTA3LjI4NiAxNzkuODU0IEMgMTA4LjI3OSAxNzcuOTc4IDEwOC44NjggMTc1Ljg0NSAxMDguODY4IDE3My42MDIgQyAxMDguODY4IDE3MS4zNTggMTA4LjI3OSAxNjkuMTg4IDEwNy4yODYgMTY3LjM0OSBDIDEwNy4yNSAxNjcuMjc1IDEwNy4yMTMgMTY3LjIwMiAxMDcuMTc2IDE2Ny4xNjUgWiIgc3R5bGU9InN0cm9rZS13aWR0aDogMTsgZmlsbDogcmdiKDIyLCAxMTksIDI1NSk7IiBpZD0ib2JqZWN0LTAiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIDAsIDEuNDIxMDg1NDcxNTIwMjAwNGUtMTQpIi8+PC9zdmc+";

const FormItem = Form.Item;
const createrTitle = (
  <>
    <Plus className="anticon" size={15} strokeWidth={3} />
    <span>
      新建节点<small>(当前目录下)</small>
    </span>
  </>
);
const modifyTitle = (
  <>
    <FilePenLine className="anticon" size={14} strokeWidth={3} />
    <span>修改节点</span>
  </>
);

export type WorkflowEditProps = {
  item: Partial<_Node.INode>;
  onSuccess: () => void;
  onCancel: () => void;
};

const Component: FC<WorkflowEditProps> = ({ item, onCancel, onSuccess }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<"npm" | "name">();
  const { fileNavigate } = useEntityNavigate();
  const [npmInfo, setNpmInfo] = useState(!!item.npm);
  const [form] = Form.useForm<_Node.INode>();
  const kindValue = Form.useWatch("kind", form);

  const entityCreater = useMutation({
    mutationFn: EntityAPI.createItem,
    onSuccess: (res) => {
      BaseWidgets.message.success("创建成功！");
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey] });
      onSuccess();
      setTimeout(() => fileNavigate({ id: res.id, type: item.type! }));
    },
  });

  const entityUpdater = useMutation({
    mutationFn: EntityAPI.updateItem,
    onSuccess: () => {
      BaseWidgets.message.success("修改成功！");
      queryClient.invalidateQueries({ queryKey: [EntityAPI.listQueryKey] });
      queryClient.invalidateQueries({ queryKey: [EntityAPI.itemQueryKey] });
      onSuccess();
    },
  });

  const npmValidator = useEvent(async (_: any, value: string): Promise<void> => {
    setLoading("npm");
    setNpmInfo(false);
    return queryClient
      .fetchQuery(NodeAPI.queryNpmInfo(value))
      .then((res) => {
        form.setFieldsValue(res);
        setNpmInfo(true);
      })
      .finally(() => {
        setLoading(undefined);
      });
  });

  const npmRules = useMemo(() => [{ required: true }, { validator: npmValidator }], [npmValidator]);

  const onValuesChange = useEvent((values: Partial<_Node.INode>) => {
    if (values.kind) {
      setTimeout(() => {
        const isOrigin = values.kind === item.kind;
        const fileds = ["npm", "name", "icon", "runtime", "desc", "content"].map((key) => {
          const name = key as keyof _Node.INode;
          return {
            name,
            value: isOrigin ? item[name] : undefined,
            errors: [],
          };
        });
        form.setFields(fileds);
        setNpmInfo(isOrigin ? !!item.npm : false);
      });
    }
  });

  const onFinish = useEvent((values: _Node.INode): void => {
    const error = verifyFileName(values.name);
    if (error) {
      form.setFields([{ name: "name", errors: [error] }]);
    } else {
      if (values.name !== item.name) {
        setLoading("name");
        EntityAPI.checkFileName(values.parentId, values.name)
          .then((exists) => {
            if (exists) {
              form.setFields([{ name: "name", errors: ["当前目录下该名称已经存在！"] }]);
            } else {
              if (values.id) {
                entityUpdater.mutate(values);
              } else {
                entityCreater.mutate(values);
              }
            }
          })
          .finally(() => {
            setLoading(undefined);
          });
      } else {
        if (values.id) {
          entityUpdater.mutate(values);
        } else {
          entityCreater.mutate(values);
        }
      }
    }
  });

  return (
    <Modal open title={item.id ? modifyTitle : createrTitle} width={550} footer={null} closable={false} onCancel={onCancel}>
      <div className={styles.NodeEdit}>
        <LoadingMask show={loading === "npm"} />
        <Form layout="vertical" form={form} initialValues={item} onValuesChange={onValuesChange} onFinish={onFinish}>
          <FormItem hidden name="id" />
          <FormItem hidden name="parentId" />
          <FormItem hidden name="type" />
          <FormItem hidden name="spaceType" />
          <FormItem hidden name="spaceId" />
          <FormItem name="kind" noStyle>
            <Kind />
          </FormItem>
          {kindValue === "snippet" ? (
            <FormItem label="名称" name="name" rules={FileNameRule}>
              <Input variant="filled" placeholder="请输入名称..." />
            </FormItem>
          ) : (
            <>
              <FormItem label="包地址" name="npm" validateFirst validateTrigger="onBlur" rules={npmRules}>
                <Input variant="filled" placeholder="请输入名称..." allowClear />
              </FormItem>
              {npmInfo && (
                <>
                  <FormItem label="名称&图标" name="name" rules={FileNameRule} className={`${styles.NodeEdit}__name`}>
                    <Input variant="filled" placeholder="请输入名称..." />
                  </FormItem>
                  <FormItem name="icon" noStyle>
                    <img alt="node" src={DefaultNodeIcon} className={`${styles.NodeEdit}__logo`} />
                  </FormItem>
                </>
              )}
            </>
          )}
          {(kindValue === "snippet" || npmInfo) && (
            <>
              <FormItem label="运行环境" name="runtime" rules={RequiredRule}>
                <Select variant="filled" placeholder="请输入运行环境..." options={RuntimeOptions} />
              </FormItem>
              <FormItem label="描述" tooltip="可用于搜索" name="desc">
                <Input.TextArea variant="filled" rows={2} placeholder="请输入描述..." showCount maxLength={100} />
              </FormItem>
              <FormItem label="DSL" name="content" rules={RequiredRule}>
                <Input.TextArea variant="filled" rows={5} placeholder="请输入默认DSL..." />
              </FormItem>
            </>
          )}
          <div className="g-form-footer">
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" htmlType="submit" loading={loading === "name" || entityUpdater.isPending || entityCreater.isPending}>
              提交
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default memo(Component);
