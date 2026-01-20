import { Module } from "@nestjs/common";
import { NodeController } from "./node.controller";
import { NodeService } from "./node.service";

@Module({
  providers: [NodeService],
  controllers: [NodeController],
  exports: [NodeService],
})
export class NodeModule {}
