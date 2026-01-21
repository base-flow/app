import { Module } from "@nestjs/common";
import { PersonalController } from "./personal.controller";

@Module({
  providers: [],
  controllers: [PersonalController],
  exports: [],
})
export class PersonalModule {}
