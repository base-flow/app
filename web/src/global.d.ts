/** biome-ignore-all lint/correctness/noUnusedVariables: <> */
declare module "*.css";
declare module "*.scss";
declare module "*.svg";
interface Window {
  API_PROXY?: string;
}

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      "em-emoji": any;
    }
  }
}
