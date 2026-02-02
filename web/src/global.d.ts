/** biome-ignore-all lint/correctness/noUnusedVariables: <> */
declare module "*.css";
declare module "*.scss";
declare module "*.svg";
interface Window {
  React: any;
  ReactDOM: any;
  axios: any;
  dayjs: any;
  antd: any;
  Baseflow: any;
  BaseflowWidgets: any;
  Locale: {
    name: string;
    antd: any;
    baseflow: any;
    app: any;
  };
  BASE_PATH?: string;
  API_PROXY?: string;
}

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      "em-emoji": any;
    }
  }
}
