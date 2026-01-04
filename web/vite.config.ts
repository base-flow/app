import path from "node:path";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import pluginExternal from "vite-plugin-external";
// import { viteExternalsPlugin } from "vite-plugin-externals";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { getLocalIP } from "./scripts/utils";

console.log(getLocalIP());

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
      name: "custom-end",
      closeBundle() {
        replaceInFileSync({
          files: path.join(__dirname, "dist/index.html"),
          from: ["react.development.js", "react-dom.development.js"],
          to: ["react.production.min.js", "react-dom.production.min.js"],
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      external: Object.keys(cdnExternals),
    },
  },
});
