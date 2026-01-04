import * as fs from "node:fs";
import * as path from "node:path";
import * as yaml from "js-yaml";

let cachedConfig: any = null;

export default function getRawConfig(): any {
  if (!cachedConfig) {
    const env = process.env.NODE_ENV || "development";
    const configPath = path.resolve(`env/${env}.yaml`);
    console.log(configPath);
    const file = fs.readFileSync(configPath, "utf8");
    cachedConfig = yaml.load(file);
  }
  return cachedConfig;
}
