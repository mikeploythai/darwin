import { createEnv } from "@t3-oss/env-core";
import z from "zod";

const env = createEnv({
  server: {
    BOT_TOKEN: z.string().min(1),
    CHANNEL_ID: z.string().min(1),
    DARWIN_URL: z.url(),
    DARWIN_SECRET: z.string(),
    UPSTASH_REDIS_REST_URL: z.url(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
  },
  clientPrefix: "PUBLIC_",
  client: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export default env;
