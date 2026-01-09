import type { IBaseWidgets, SchemaModel } from "@baseflow/react";
import { DataType, FlowConfigProvider } from "@baseflow/react";
import { DatePicker, DescMD, StringInput, StringSelect, TimePicker } from "@baseflow/widgets";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Button, ConfigProvider, Modal, message, Segmented, Spin, Switch } from "antd";
import { useState } from "react";
import Header from "@/modules/app/components/Header";
import { useAppStore } from "@/modules/app/store";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: () => {
    return useAppStore.getState().authCheck();
  },
  component: RootComponent,
});

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
  const [modal, contextHolder] = Modal.useModal();

  const [widgets] = useState<Partial<IBaseWidgets>>(() => ({
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
      modal.confirm({
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
  }));

  return (
    <>
      <ConfigProvider
        locale={window.Locale.antd}
        theme={{
          //zeroRuntime: true,
          hashed: false,
          cssVar: {
            key: "ͼbaseflow",
          },
          token: {
            colorPrimaryBgHover: "var(--bf-bg-filled2)",
            colorPrimaryBg: "var(--bf-bg-active)",
            colorPrimaryBorder: "var(--bf-bg-active)",
            fontSize: 13,
            colorTextPlaceholder: "var(--bf-tx-placeholder)",
            colorText: "var(--bf-tx-body)",
            colorFillTertiary: "var(--bf-bg-filled2)",
          },
        }}
      >
        <FlowConfigProvider
          locale={window.Locale.name}
          lang={window.Locale.baseflow}
          widgets={widgets}
          monacoEditorUrl="/monaco/index.html"
          expressionUtils={expressionUtils}
        >
          <header>
            <Header />
          </header>
          <article>
            <Outlet />
          </article>
        </FlowConfigProvider>
        {contextHolder}
      </ConfigProvider>
      {/* <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools position="bottom-right" /> */}
    </>
  );
}
