import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

const env = createEnv({
  server: {
    BOT_TOKEN: z.string().min(1),
    CHANNEL_ID: z.string().min(1),
    ROLE_ID: z.string().min(1),
    OPENROUTER_API_KEY: z.string().min(1),
    QSTASH_TOKEN: z.string().min(1),
    QSTASH_CURRENT_SIGNING_KEY: z.string().min(1),
    QSTASH_NEXT_SIGNING_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {},
});

export default env;
