import { DiscordAPIError } from "@discordjs/rest";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { APICallError } from "ai";
import { Routes } from "discord-api-types/v10";
import { NextResponse } from "next/server";
import { discord } from "@/lib/discord";
import env from "@/lib/env";
import { weeklyPrompt } from "@/lib/prompts";
import { generateResponse } from "@/lib/utils";

export const POST = verifySignatureAppRouter(async () => {
  try {
    const { text: content } = await generateResponse(weeklyPrompt);

    await discord.post(Routes.channelMessages(env.CHANNEL_ID), {
      body: {
        content: `<@&${env.ROLE_ID}> ${content}`,
      },
    });

    return new Response("Message sent!");
  } catch (error) {
    console.error(error);

    let status = 500;
    if (error instanceof DiscordAPIError) {
      status = error.status;
    } else if (APICallError.isInstance(error) && error.statusCode) {
      status = error.statusCode;
    }

    return NextResponse.json({ error }, { status: status });
  }
});
