import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import Redis from "ioredis";
import type { RedisConfig } from "../config/redis.config";
import { CacheInterceptor } from "./cache.interceptor";
import { CacheService } from "./cache.service";

@Global()
@Module({
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory(configService: ConfigService) {
        const redisConfig = configService.get<RedisConfig>("redis")!;
        return new Redis({
          host: redisConfig.host,
          port: redisConfig.port,
        });
      },
      inject: [ConfigService],
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
