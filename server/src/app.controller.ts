import { Controller, Get } from "@nestjs/common";
import { EntityList } from "@/database";
import { sleep } from "@/utils";

@Controller()
export class AppController {
  @Get("config")
  async getConfig(): Promise<_App.Config> {
    await sleep(1000);
    return Promise.resolve({
      favMax: 100,
      sharedMax: 50,
      sharedContentMax: 10,
      platformDirs: {
        workflow: {
          server: EntityList.find((item) => item.name === "workflow-server")!.id,
          browser: EntityList.find((item) => item.name === "workflow-browser")!.id,
        },
        node: {
          server: EntityList.find((item) => item.name === "node-server")!.id,
          browser: EntityList.find((item) => item.name === "node-browser")!.id,
        },
      },
    });
  }
}
