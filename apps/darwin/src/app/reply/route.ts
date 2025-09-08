import { DiscordAPIError } from "@discordjs/rest";
import { APICallError } from "ai";
import {
  type RESTPostAPIChannelMessageJSONBody,
  Routes,
} from "discord-api-types/v10";
import { NextResponse } from "next/server";
import { discord } from "@/lib/discord";
import env from "@/lib/env";
import { replyPrompt } from "@/lib/prompts";
import { generateResponse } from "@/lib/utils";

type GumballData = {
  authorId: string;
  messageId: string;
  content: string;
  close: boolean;
};

export const POST = async (response: Response) => {
  const auth = response.headers.get("X-Darwin-Secret");
  if (auth !== env.DARWIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gumball: GumballData = await response.json();

  try {
    await discord.post(Routes.channelTyping(env.CHANNEL_ID), {});

    const { text: content } = await generateResponse(
      replyPrompt(gumball.content, gumball.close ?? false),
    );

    await discord.post(Routes.channelMessages(env.CHANNEL_ID), {
      body: {
        content,
        message_reference: {
          message_id: gumball.messageId,
          channel_id: env.CHANNEL_ID,
        },
        allowed_mentions: {
          replied_user: true,
        },
      } satisfies RESTPostAPIChannelMessageJSONBody,
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
};
