import path from "node:path";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import chalk from "chalk";
import { replaceInFileSync } from "replace-in-file";
import externalGlobals from "rollup-plugin-external-globals";
import { defineConfig } from "vite";
import pluginExternal from "vite-plugin-external";
// import { viteExternalsPlugin } from "vite-plugin-externals";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { getLocalIP } from "./scripts/utils";

const DEV_DEFAULT_API_SERVER = `
/api/ => http://${getLocalIP()}:3000/,
/i18n/ => /i18n/,
`;

const cdnExternals = {
  react: "React",
  "react-dom": "ReactDOM",
  "react-dom/client": "ReactDOM",
  axios: "axios",
  dayjs: "dayjs",
  antd: "antd",
  "@baseflow/react": "Baseflow",
  "@baseflow/widgets": "BaseflowWidgets",
};

// https://vitejs.dev/config/
export default defineConfig({
  // resolve: {
  //   alias: {
  //     "@": path.resolve(__dirname, "src"),
  //   },
  // },
  define: {
    __API_PROXY__: JSON.stringify(process.env.NODE_ENV === "production" ? "" : DEV_DEFAULT_API_SERVER),
  },
  plugins: [
    devtools(),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react({
      jsxRuntime: "classic",
    }),
    pluginExternal({ externals: cdnExternals }),
    //viteExternalsPlugin(cdnExternals),
    {
      name: "custom-log",
      configureServer(server) {
        // 确保在 server 启动后执行
        server.httpServer?.once("listening", () => {
          console.log(`\n${chalk.bgGreen("Default API Server: ")} ${chalk.green.underline(DEV_DEFAULT_API_SERVER)}`);
        });
      },
    },
  ],
  build: {
    minify: false,
    cssMinify: false,
    rollupOptions: {
      plugins: [
        externalGlobals(cdnExternals),
        {
          name: "custom-end",
          closeBundle() {
            replaceInFileSync({
              files: "./dist/index.html",
              from: ["react.development.js", "react-dom.development.js"],
              to: ["react.production.min.js", "react-dom.production.min.js"],
            });
          },
        },
      ],
    },
  },
});
