import { constants } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { replaceInFile } from "replace-in-file";

const CWD = process.cwd();
const PUBLIC_DIR = path.join(CWD, "public/cdn");
const HTML_PAGE = path.join(CWD, "index.html");
const CDNS = {
  "axios.js": "axios@1.0.0.js",
  "dayjs.js": "dayjs@1.0.0.js",
  "antd.js": "antd@1.0.0.js",
  "antd.css": "antd@1.0.0.css",
  "@baseflow@react.js": "@baseflow@react@1.0.0.js",
  "@baseflow@react.css": "@baseflow@react@1.0.0.css",
  "@baseflow@widgets.js": "@baseflow@widgets@1.0.0.js",
};

async function copyNpm(pkg) {
  const targetPath = path.join(CWD, "../node_modules", pkg.name);
  const packagePath = path.join(targetPath, "package.json");
  try {
    await fs.access(packagePath, constants.F_OK);
  } catch {
    console.warn(`⚠️ Not exist: ${packagePath}`);
    return;
  }
  const pkgContent = await fs.readFile(packagePath, "utf-8");
  const { version } = JSON.parse(pkgContent);

  const operations = pkg.files.map((item) => {
    const ext = item.split(".").pop();
    const cdnName = [`${pkg.name.replace(/\//, "@")}`, ext].join(".");
    const cdnFile = [`${pkg.name.replace(/\//, "@")}@${version}`, ext].join(".");
    return {
      src: path.join(targetPath, item),
      dest: path.join(PUBLIC_DIR, cdnFile),
      name: cdnName,
      file: cdnFile,
    };
  });

  // 执行拷贝
  for (const op of operations) {
    try {
      await fs.access(op.src, constants.F_OK);
      await fs.copyFile(op.src, op.dest);
      CDNS[op.name] = op.file;
    } catch (err) {
      console.log(err);
      if (err.code === "ENOENT") {
        console.error(`❌ Not exist: ${op.src}`);
      } else {
        throw err;
      }
    }
  }
}

await fs.rm(PUBLIC_DIR, { recursive: true, force: true });
await fs.mkdir(PUBLIC_DIR, { recursive: true });
await copyNpm({ name: "axios", files: ["dist/axios.min.js"] });
await copyNpm({ name: "dayjs", files: ["dayjs.min.js"] });
await copyNpm({ name: "antd", files: ["dist/antd.min.js", "/dist/antd.css"] });
await copyNpm({ name: "@baseflow/react", files: ["dist/umd/baseflow.js", "dist/umd/baseflow.css"] });
await copyNpm({ name: "@baseflow/widgets", files: ["dist/umd/index.js"] });

await replaceInFile({
  files: HTML_PAGE,
  from: [
    /src="\/cdn\/axios@[^"]+?.js"/,
    /src="\/cdn\/dayjs@[^"]+?.js"/,
    /src="\/cdn\/antd@[^"]+?.js"/,
    /src="\/cdn\/@baseflow@react@[^"]+?.js"/,
    /src="\/cdn\/@baseflow@widgets@[^"]+?.js"/,
    /href="\/cdn\/@baseflow@react@[^"]+?.css"/,
  ],
  to: [
    `src="/cdn/${CDNS["axios.js"]}"`,
    `src="/cdn/${CDNS["dayjs.js"]}"`,
    `src="/cdn/${CDNS["antd.js"]}"`,
    `src="/cdn/${CDNS["@baseflow@react.js"]}"`,
    `src="/cdn/${CDNS["@baseflow@widgets.js"]}"`,
    `href="/cdn/${CDNS["@baseflow@react.css"]}"`,
  ],
});

console.log(CDNS);
