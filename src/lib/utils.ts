import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
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
