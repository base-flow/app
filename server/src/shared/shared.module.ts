import { Module } from "@nestjs/common";
import { SharedController } from "./shared.controller";

@Module({
  providers: [],
  controllers: [SharedController],
  exports: [],
})
export class SharedModule {}
