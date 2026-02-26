import { Module } from "@nestjs/common";
import { NodeController } from "./node.controller";

@Module({
  providers: [],
  controllers: [NodeController],
  exports: [],
})
export class NodeModule {}
