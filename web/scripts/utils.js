import net from "node:net";
import { networkInterfaces } from "node:os";

let localIP = "";

export function getLocalIP() {
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

export function checkPort(port) {
  const server = net.createServer().listen(port);
  return new Promise((resolve, reject) => {
    server.on("listening", () => {
      server.close();
      resolve(true);
    });
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(false);
      } else {
        reject(err);
      }
    });
  });
}
