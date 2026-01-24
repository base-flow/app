import net from "node:net";
import { networkInterfaces } from "node:os";

let localIP = "";

export function getLocalIP(): string {
  if (!localIP) {
    localIP = "localhost";
    const interfaces = networkInterfaces();
    for (const devName in interfaces) {
      const isEnd = interfaces[devName]?.some((item) => {
        // 取IPv4, 不为127.0.0.1的内网ip
        if (item.family === "IPv4" && item.address !== "127.0.0.1" && !item.internal) {
          localIP = item.address;
          return true;
        }
        return false;
      });
      // 若获取到ip, 结束遍历
      if (isEnd) {
        break;
      }
    }
  }

  return localIP;
}

export function checkPort(port: number) {
  const server = net.createServer().listen(port);
  return new Promise((resolve, reject) => {
    server.on("listening", () => {
      server.close();
      resolve(true);
    });
    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        resolve(false);
      } else {
        reject(err);
      }
    });
  });
}

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function extendAssign(origin: { [key: string]: any }, target: { [key: string]: any }): void {
  Object.keys(origin).forEach((key) => {
    if (target.hasOwnProperty(key)) {
      origin[key] = target[key];
    }
  });
}

export const FlagSrc = {
  list: {
    emoji: [
      [":eyes:", "👀"],
      [":smile:", "😀"],
      [":man-surfing:", "🏄‍♂️"],
      [":clown_face:", "🤡"],
      [":alien:", "👽"],
      [":ghost:", "👻"],
      [":red_haired_woman:", "👩‍🦰"],
      [":bicyclist:", "🚴"],
    ],
    bgColor: ["#fef7c3", "#ffead5", "#ffe4e8", "#fbe8ff", "#ece9fe", "#e0eaff", "#e4fbcc", "#d3f8df", "#d5f5f6", "#e0f2fe", "#d1e9ff", "#d1e0ff"],
  },
  encode(source: { icon?: string; emoji?: string; bgColor?: string; native?: string }): string {
    const { icon, emoji = "+1", native = "👍", bgColor = "#ffff00" } = source;
    if (icon) {
      return icon;
    } else {
      return `emoji://${bgColor}@${emoji}@${native}`;
    }
  },
  create(): string {
    const emoji = FlagSrc.list.emoji[getRandomInt(0, FlagSrc.list.emoji.length - 1)];
    return FlagSrc.encode({ emoji: emoji[0], bgColor: FlagSrc.list.bgColor[getRandomInt(0, FlagSrc.list.bgColor.length - 1)], native: emoji[1] });
  },
};

export function randomInt(min: number, max: number, includeMax: boolean = true): number {
  if (min > max) {
    [min, max] = [max, min];
  }

  const range = includeMax ? max - min + 1 : max - min;
  return Math.floor(Math.random() * range) + min;
}
