import { registerAs } from "@nestjs/config";
import { z } from "zod";
import getRawConfig from "./parse";

export const configSchema = z.object({
  host: z.string(),
  port: z.number(),
});

export type RedisConfig = z.infer<typeof configSchema>;

export default registerAs("redis", (): RedisConfig => {
  const raw = getRawConfig().redis;
  const result = configSchema.safeParse(raw);
  if (!result.success) {
    console.error("❌ RedisConfig error:", result.error.format());
    throw new Error("Invalid configuration");
  }
  return raw;
});
