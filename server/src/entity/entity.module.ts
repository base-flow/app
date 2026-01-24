import { Module } from "@nestjs/common";
import { EntityController } from "./entity.controller";

@Module({
  providers: [],
  controllers: [EntityController],
  exports: [],
})
export class EntityModule {}
