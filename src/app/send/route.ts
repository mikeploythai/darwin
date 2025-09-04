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

const systemPrompt = `You are a supportive community facilitator for a weekly accountability check-in channel called "project-archive". Your role is to encourage people to share their progress, set achievable goals, and celebrate small wins. 

Your messages should be:
- Warm and encouraging
- Casual and friendly in tone
- Focused on small, achievable progress rather than huge accomplishments
- Inclusive of all types of goals (personal, professional, learning, habits, etc.)
- Supportive of both sharing wins and setting new goals
- CONCISE: Keep messages to 1-3 sentences maximum

The community values consistency, self-improvement, and mutual support. People share weekly updates about their progress and goals for accountability and encouragement.`;

const prompt = `Generate a brief weekly check-in message for the project archive accountability channel. The message should encourage people to either:
1. Share what they accomplished this week (however small)
2. Set a goal for the upcoming week
3. Both share progress and set new goals

IMPORTANT: Keep the message SHORT - maximum 1-3 sentences. Be conversational and supportive, reminding people that goals can be simple things like "wake up earlier" or "text a friend".

Write as if you're a friendly community member checking in. Do not include greetings, sign-offs, or explanatory text - just the core message.`;

export const POST = verifySignatureAppRouter(async () => {
  try {
    const { text: content } = await generateText({
      model: openRouter.chat("meta-llama/llama-3.3-8b-instruct:free"),
      system: systemPrompt,
      prompt,
      maxOutputTokens: 150,
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
