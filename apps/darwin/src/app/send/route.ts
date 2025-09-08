import { DiscordAPIError } from "@discordjs/rest";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { APICallError } from "ai";
import {
  type APIMessage,
  type RESTPostAPIChannelMessageJSONBody,
  Routes,
} from "discord-api-types/v10";
import { NextResponse } from "next/server";
import { discord } from "@/lib/discord";
import env from "@/lib/env";
import { weeklyPrompt } from "@/lib/prompts";
import redis from "@/lib/redis";
import { generateResponse, setRedisExpiration } from "@/lib/utils";

export const POST = verifySignatureAppRouter(async () => {
  try {
    await discord.post(Routes.channelTyping(env.CHANNEL_ID), {});

    const { text: content } = await generateResponse(weeklyPrompt);

    const message = (await discord.post(
      Routes.channelMessages(env.CHANNEL_ID),
      {
        body: {
          content: `<@&${env.ROLE_ID}> ${content}`,
        } satisfies RESTPostAPIChannelMessageJSONBody,
      },
    )) as APIMessage;

    await redis.set("weekly:current", message.id, { ex: setRedisExpiration() });

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
