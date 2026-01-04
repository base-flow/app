import { Module } from "@nestjs/common";
import { FlowAppController } from "./flowApp.controller";
import { FlowAppService } from "./flowApp.service";

@Module({
  providers: [FlowAppService],
  controllers: [FlowAppController],
  exports: [FlowAppService],
})
export class FlowAppModule {}
