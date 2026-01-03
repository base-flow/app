import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

export function getExecutors2() {
  const stdout = execSync('npm query "*"', {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "ignore"],
  });
}

function getExecutors(lang = "node") {
  if (!fs.existsSync(path.join(process.cwd(), "node_modules"))) {
    throw "❌ 错误：未找到 node_modules 目录。";
  }
  const output = execSync('npm query "*"', {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 20,
  });

  const packages = JSON.parse(output);

  const result = {};

  for (const pkg of packages) {
    // 排除 workspace 或者无效包名的情况
    if (!pkg.name || !pkg.version) continue;
    const key = `${pkg.name}@${pkg.version}`;
    const executor = pkg.executor || {};
    result[key] = executor[lang] || "";
  }

  return result;
}

function getExecutors2(lang = "node") {
  if (!fs.existsSync(path.join(process.cwd(), "node_modules"))) {
    throw "❌ 错误：未找到 node_modules 目录。";
  }
  const output = execSync('npm query "*"', {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 20,
  });

  const packages = JSON.parse(output);
  const result = {};

  for (const pkg of packages) {
    const executor = pkg.executor?.[lang];
    if (!executor) continue;
    // 提取 location，例如 "node_modules/react/node_modules/loose-envify"
    // 分割后得到路径数组：['react', 'loose-envify']
    const pathSegments = parseLocation(pkg.location);
    if (pathSegments.length === 0) continue;

    let currentNode = result;
    // 沿路径深入构建树
    for (const segment of pathSegments) {
      if (!currentNode[segment]) {
        currentNode[segment] = {};
      }
      currentNode = currentNode[segment];
    }
    currentNode["."] = executor;
  }

  return result;
}

/**
 * 解析 location 字符串为路径数组
 * 处理 Windows/Unix 路径差异，并处理 scoped packages (@types/node)
 */
function parseLocation(location) {
  if (!location) return [];
  // 统一路径分隔符，并按 node_modules 分割
  // 也就是将 "node_modules/A/node_modules/B" -> ["A", "B"]
  // 注意：split 可能会产生空字符串，需过滤
  return location
    .split(/node_modules[\\/]/)
    .filter(Boolean)
    .map((part) => part.replace(/[\\/]$/, "")); // 去除末尾可能存在的斜杠
}

const executors = getExecutors2();

console.log(executors);
