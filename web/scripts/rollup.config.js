import fs from "node:fs";
import path from "node:path";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import url from "@rollup/plugin-url";
import autoprefixer from "autoprefixer";
import del from "rollup-plugin-delete";
import externalGlobals from "rollup-plugin-external-globals";
import license from "rollup-plugin-license";
import postcss from "rollup-plugin-postcss";

const FilterPackageFields = {
  private: true,
  scripts: true,
  dependencies: true,
  devDependencies: true,
  peerDependencies: true,
};
const SrcDir = process.cwd();
const SrcDirName = path.basename(SrcDir);
const SrcPackageFile = path.join(SrcDir, "package.json");
const SrcPackageContent = fs.readFileSync(SrcPackageFile, "utf-8");
const SrcPackageJson = JSON.parse(SrcPackageContent);
const DistPackageJson = {};
for (const key in SrcPackageJson) {
  if (!FilterPackageFields[key]) {
    DistPackageJson[key] = SrcPackageJson[key];
  }
}
// const NodeExecutor = SrcPackageJson.executor?.node;
// if (NodeExecutor) {
//   const arr = NodeExecutor.split("@");
//   const version = arr.pop();
//   DistPackageJson.dependencies = {
//     [arr.join("@")]: version,
//   };
// }
const DistDir = path.join(import.meta.dirname, "../public/nodes", SrcDirName);
fs.mkdirSync(DistDir, { recursive: true });
const DistPackageFile = path.join(DistDir, "package.json");
fs.writeFileSync(DistPackageFile, JSON.stringify(DistPackageJson, null, 2));

// fs.copyFileSync(SrcPackageFile, DistPackageFile);
// replaceInFileSync({
//   files: DistPackageFile,
//   from: /"(scripts|devDependencies|peerDependencies)":\s*{[^}]+?}/,
//   to: `"scripts": {}`,
// });

const extensions = [".js", ".ts", ".tsx", ".jsx"];
const cdnExternals = {
  react: "React",
  "react-dom": "ReactDOM",
  "react-dom/client": "ReactDOM",
  dayjs: "dayjs",
  antd: "antd",
  "@baseflow/react": "Baseflow",
  "@baseflow/widgets": "BaseflowWidgets",
};

export default {
  input: "index.ts",
  output: {
    file: path.join(DistDir, "index.js"),
    format: "esm",
    sourcemap: false,
  },
  plugins: [
    resolve({ extensions, browser: true }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    commonjs(),
    json(),
    license({
      sourcemap: false,
      // banner: {
      //   commentStyle: "regular",
      //   content: {
      //     file: path.join(SrcDir, "LICENSE"),
      //   },
      // },
      thirdParty: {
        includeSelf: true, // Default is false.
        output: {
          file: path.join(DistDir, "LICENSES-THIRD-PARTY"),
        },
      },
    }),
    url({
      include: ["**/*.svg", "**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif"],
      limit: 10 * 1024, // <10kb 转 base64
      emitFiles: true,
    }),
    postcss({
      // modules: false, // css-module
      extract: false, // css 文件
      minimize: true,
      sourceMap: false,
      url: { maxSize: 10 * 1024 },
      extensions: [".scss", ".css"],
      use: [
        [
          "sass",
          {
            // 在这里屏蔽特定的废弃警告
            silenceDeprecations: ["legacy-js-api"],
          },
        ],
      ],
      plugins: [autoprefixer()],
    }),
    //   esbuild({
    //     target: "es2022",
    //     tsconfig: "../../../tsconfig.build.json",
    //     //jsx: "transform", //无效
    //     // minify: true,
    //   }),
    babel({
      babelHelpers: "bundled",
      extensions,
      exclude: "node_modules/**",
      presets: [
        ["@babel/preset-react", { runtime: "classic" }],
        ["@babel/preset-typescript", { allowDeclareFields: true }],
        [
          "@babel/preset-env",
          {
            targets: { chrome: "100" },
            useBuiltIns: "usage",
            corejs: 3,
            modules: false,
          },
        ],
      ],
      plugins: [["babel-plugin-react-compiler"]],
    }),
    externalGlobals(cdnExternals),
    // terser({
    //   // 压缩选项
    //   compress: {
    //     pure_funcs: ["console.log"], // 移除指定函数
    //     // 更多压缩选项：https://github.com/terser/terser#compress-options
    //   },
    //   // 混淆选项
    //   mangle: true,
    //   // 输出选项
    //   format: {
    //     comments: false, // 移除注释
    //   },
    // }),
  ],
};
