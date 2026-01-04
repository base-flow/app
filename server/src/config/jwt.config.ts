import { registerAs } from "@nestjs/config";
import { z } from "zod";
import getRawConfig from "./parse";

export const configSchema = z.object({
  secret: z.string(),
  expiresIn: z.string(),
});

export type JwtConfig = z.infer<typeof configSchema>;

export default registerAs("jwt", (): JwtConfig => {
  const raw = getRawConfig().jwt;
  console.log(111, raw);
  const result = configSchema.safeParse(raw);
  if (!result.success) {
    console.error("❌ JwtConfig error:", result.error.format());
    throw new Error("Invalid configuration");
  }
  return raw;
});
