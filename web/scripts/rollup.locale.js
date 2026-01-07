import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";

import terser from "@rollup/plugin-terser";

const Locale = process.env.LOCALE;

export default {
  input: `./src/i18n/${Locale}.js`,
  output: {
    file: `./public/i18n/${Locale}.js`,
    format: "umd",
    sourcemap: false,
    name: "Locale",
    globals: {
      dayjs: "dayjs",
    },
  },
  external: ["dayjs"],
  plugins: [
    resolve({ browser: true }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    commonjs(),
    json(),
    // esbuild({
    //   target: "es2022",
    //   // tsconfig: "../../../tsconfig.build.json",
    //   // //jsx: "transform", //无效
    //   // // minify: true,
    // }),
    terser({
      // 压缩选项
      compress: true,
      // 混淆选项
      mangle: true,
      // 输出选项
      format: {
        comments: false, // 移除注释
      },
    }),
  ],
};
