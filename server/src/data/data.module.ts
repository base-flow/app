import { Module } from "@nestjs/common";
import { DataController } from "./data.controller";

@Module({
  providers: [],
  controllers: [DataController],
  exports: [],
})
export class DataModule {}
