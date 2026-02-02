import { Module } from "@nestjs/common";
import { FavoriteController } from "./favorite.controller";

@Module({
  providers: [],
  controllers: [FavoriteController],
  exports: [],
})
export class FavoriteModule {}
