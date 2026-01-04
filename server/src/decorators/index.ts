import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = "roles";
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const CACHEABLE_META = "cacheable_meta";
export interface CacheableOptions {
  key?: string | ((...args: any[]) => string);
  ttl?: number;
}
export const Cacheable = (options: CacheableOptions = {}) => SetMetadata(CACHEABLE_META, options);
