import { Module } from "@nestjs/common";
import { GotSharedController } from "./gotShared.controller";

@Module({
  providers: [],
  controllers: [GotSharedController],
  exports: [],
})
export class GotSharedModule {}
