import { DiscordAPIError, REST } from "@discordjs/rest";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { APICallError, generateText } from "ai";
import { Routes } from "discord-api-types/v10";
import { NextResponse } from "next/server";
import env from "@/lib/env";
import { prompt, systemPrompt } from "@/lib/prompts";

const rest = new REST({ version: "10" }).setToken(env.BOT_TOKEN);

const openRouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

export const POST = verifySignatureAppRouter(async () => {
  try {
    const { text: content } = await generateText({
      model: openRouter.chat("meta-llama/llama-3.3-8b-instruct:free"),
      system: systemPrompt,
      prompt,
      maxOutputTokens: 250,
    });

    await rest.post(Routes.channelMessages(env.CHANNEL_ID), {
      body: {
        content: `<@&${env.ROLE_ID}> ${content}`,
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
