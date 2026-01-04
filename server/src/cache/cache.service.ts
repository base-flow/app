import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class CacheService {
  constructor(@Inject("REDIS_CLIENT") private readonly redis: Redis) {}

  get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  set(key: string, value: string | number, second: number): Promise<"OK"> {
    return this.redis.set(key, value, "EX", second);
  }
}
