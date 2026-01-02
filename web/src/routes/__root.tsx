import type { IBaseWidgets, SchemaModel } from "@baseflow/react";
import { DataType, FlowConfigProvider } from "@baseflow/react";
import { DatePicker, DescMD, StringInput, StringSelect, TimePicker } from "@baseflow/widgets";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Button, ConfigProvider, Modal, message, Segmented, Spin, Switch } from "antd";
// import enUS from 'antd/locale/en_US';
// import zhCN from "antd/locale/zh_CN";
// import 'dayjs/locale/zh-cn';
// import Header from "~/_core/components/Header";
// import { useCoreStore } from "~/_core/store";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  // beforeLoad: () => {
  //   return useCoreStore.getState().authCheck();
  // },
  component: RootComponent,
});

const Locale = localStorage.getItem("baseflow-locale") || "";

const widgets: Partial<IBaseWidgets> = {
  Button: Button as any,
  Spin: Spin as any,
  Segmented,
  Input: StringInput,
  Select: StringSelect,
  Switch: Switch as any,
  TextArea: StringInput as any,
  DatePicker,
  TimePicker,
  DescMD,
  message,
  confirm: (message: string, callback: (ok: boolean) => void, props?: { title?: string; okText?: string; cancelText?: string }) => {
    Modal.confirm({
      title: "提示",
      content: message,
      ...props,
      onOk() {
        callback(true);
      },
      onCancel() {
        callback(false);
      },
    });
  },
};

const expressionUtils: SchemaModel = {
  name: "utils",
  type: DataType.Object,
  disabled: true,
  children: [
    {
      name: "string",
      label: "字符处理",
      type: DataType.Object,
      disabled: true,
      children: [
        { name: "camelCase", label: "camelCase([string=''])", type: DataType.String, tips: "转换字符串string为驼峰写法。" },
        { name: "capitalize", label: "capitalize([string=''])", type: DataType.String, tips: "转换字符串string首字母为大写，剩下为小写。" },
      ],
    },
    {
      name: "number",
      label: "数字计算",
      type: DataType.Object,
      disabled: true,
      children: [
        { name: "clamp", label: "clamp(number, [lower], upper)", type: DataType.Number, tips: "返回限制在 lower 和 upper 之间的值" },
        {
          name: "inRange",
          label: "inRange(number, [start=0], end)",
          type: DataType.Number,
          tips: "检查 n 是否在 start 与 end 之间，但不包括 end。 如果 end 没有指定，那么 start 设置为0。 如果 start 大于 end，那么参数会交换以便支持负范围。",
        },
      ],
    },
  ],
};

function RootComponent() {
  return (
    <>
      <ConfigProvider>
        <FlowConfigProvider locale={Locale} widgets={widgets} monacoEditorUrl="/monaco/index.html" expressionUtils={expressionUtils}>
          <header>
            <div />
          </header>
          <article>
            <Outlet />
          </article>
        </FlowConfigProvider>
      </ConfigProvider>
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
