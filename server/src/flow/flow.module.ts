import { Module } from "@nestjs/common";
import { FlowAppModule } from "@/flowApp/flowApp.module";
import { FlowAppService } from "@/flowApp/flowApp.service";
import { FlowController } from "./flow.controller";
import { FlowService } from "./flow.service";

@Module({
  imports: [FlowAppModule],
  providers: [FlowService, FlowAppService],
  controllers: [FlowController],
})
export class FlowModule {}
