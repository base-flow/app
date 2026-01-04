import { Module } from "@nestjs/common";
import { FlowNodeController } from "./flowNode.controller";
import { FlowNodeService } from "./flowNode.service";

@Module({
  providers: [FlowNodeService],
  controllers: [FlowNodeController],
  exports: [FlowNodeService],
})
export class FlowNodeModule {}
