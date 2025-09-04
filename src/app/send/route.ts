import { DiscordAPIError, REST } from "@discordjs/rest";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { APICallError, generateText } from "ai";
import { Routes } from "discord-api-types/v10";
import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is missing");

const CHANNEL_ID = process.env.CHANNEL_ID;
if (!CHANNEL_ID) throw new Error("CHANNEL_ID is missing");

const ROLE_ID = process.env.ROLE_ID;
if (!ROLE_ID) throw new Error("ROLE_ID is missing");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is missing");

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

const openRouter = createOpenRouter({
  apiKey: OPENROUTER_API_KEY,
});

const systemPrompt = `You are a warm, encouraging friend who facilitates weekly check-ins for a self-improvement accountability group called "project-archive". You genuinely care about people's growth and celebrate small wins.

Your personality:
- Genuinely excited about people's progress
- Warm and conversational, like texting a friend
- Values small steps over big achievements
- Makes people feel safe to share or just lurk
- Keeps things light and encouraging

Your messages are always 1-3 sentences max and feel personal, not robotic.`;

const prompt = `Write a weekly check-in message for your accountability friends. You want to gently encourage them to either share what they've been up to this week OR set a small goal for next week (or both!).

Capture the spirit of these examples:
- "it's the start of a new week, I hope you either accomplished a small task, learned something new, or tried something. What's your goals for next week?"
- "Just a reminder the purpose of this channel is to encourage you all to work on your goals and to also praise you for any small achievements you've made."
- "How is everyone doing?"

Write something that feels genuine and warm, like you're actually checking in on friends. Keep it short (1-3 sentences) and conversational.`;

export const POST = verifySignatureAppRouter(async () => {
  try {
    const { text: content } = await generateText({
      model: openRouter.chat("meta-llama/llama-3.3-8b-instruct:free"),
      system: systemPrompt,
      prompt,
      maxOutputTokens: 250,
    });

    await rest.post(Routes.channelMessages(CHANNEL_ID), {
      body: {
        content: `<@&${ROLE_ID}> ${content}`,
      },
    });

    return new Response("Message sent!");
  } catch (error) {
    console.error(error);

    let status = 400;
    if (error instanceof DiscordAPIError) {
      status = error.status;
    } else if (APICallError.isInstance(error) && error.statusCode) {
      status = error.statusCode;
    }

    return NextResponse.json({ error }, { status: status });
  }
});
