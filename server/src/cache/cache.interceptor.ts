import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type Redis from "ioredis";
import type { Observable } from "rxjs";
import { from } from "rxjs";
import { tap } from "rxjs/operators";
import type { CacheableOptions } from "../decorators";
import { CACHEABLE_META } from "../decorators";

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, any>();
  constructor(
    private reflector: Reflector,
    @Inject("REDIS_CLIENT") private readonly redis: Redis,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    // const request = context.switchToHttp().getRequest();
    // const key = request.url; // 使用URL作为缓存键
    const target = context.getClass();
    const method = context.getHandler();
    const cacheMeta = this.reflector.get<CacheableOptions | null>(CACHEABLE_META, method) || null;

    if (!cacheMeta) {
      return next.handle();
    }

    const args = context.getArgs();
    const ttl = cacheMeta.ttl || 60;
    const rawKey =
      typeof cacheMeta.key === "function" ? cacheMeta.key(...args) : cacheMeta.key || `${target.name}:${method.name}:${JSON.stringify(args)}`;
    const cacheKey = `cacheable:${rawKey}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return from([cached]);
    }

    return next.handle().pipe(
      tap(async (result) => {
        await this.redis.set(cacheKey, JSON.stringify(result), "EX", ttl);
      }),
    );
  }
}
