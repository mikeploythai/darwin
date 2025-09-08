import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import env from "./env";
import { systemPrompt } from "./prompts";

const openRouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

export const generateResponse = async (prompt: string) =>
  await generateText({
    model: openRouter.chat("meta-llama/llama-3.3-8b-instruct:free"),
    system: systemPrompt,
    prompt,
    maxOutputTokens: 250,
  });

dayjs.extend(utc);
dayjs.extend(timezone);

export function setRedisExpiration(bufferSeconds = 60): number {
  const zone = "America/Los_Angeles";

  const now = dayjs().tz(zone);
  let next = now.tz(zone).day(6).hour(10).minute(0).second(0).millisecond(0);

  if (next.isBefore(now)) {
    next = next.add(1, "week");
  }

  const diffSeconds = Math.floor(next.diff(now, "second"));
  return Math.max(1, diffSeconds - bufferSeconds);
}
