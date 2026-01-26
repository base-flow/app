import { Controller, Get } from "@nestjs/common";
import { sleep } from "@/utils";
@Controller()
export class AppController {
  @Get("config")
  async getConfig(): Promise<_App.Config> {
    await sleep(1000);
    return Promise.resolve({
      dirs: {
        workflow: {
          _: "_workflow",
          server: "",
          browser: "",
        },
        node: {
          _: "_node",
          server: "",
          browser: "",
        },
      },
    });
  }
}
