import { WebSocketManager, WebSocketShardEvents } from "@discordjs/ws";
import {
  GatewayDispatchEvents,
  GatewayIntentBits,
  MessageType,
} from "discord-api-types/v10";
import { discord } from "./lib/discord.ts";
import env from "./lib/env.ts";

const main = async () => {
  const ws = new WebSocketManager({
    token: env.BOT_TOKEN,
    intents:
      GatewayIntentBits.Guilds |
      GatewayIntentBits.GuildMessages |
      GatewayIntentBits.MessageContent,
    rest: discord,
  });

  let botUserId: string | null = null;

  ws.on(WebSocketShardEvents.Dispatch, async ({ t, d }) => {
    try {
      if (t === GatewayDispatchEvents.Ready) {
        botUserId = d.user.id;
        console.log(`Ready as ${d.user.username} (${botUserId})`);
        return;
      }

      if (t === GatewayDispatchEvents.MessageCreate) {
        if (d.channel_id !== env.CHANNEL_ID || d.author.bot) return;

        const parentMessageId = d.message_reference?.message_id;

        const isReply = d.type === MessageType.Reply && !!parentMessageId;
        if (!isReply) return;

        const repliedToBot = d.referenced_message?.author?.id === botUserId;
        if (!repliedToBot) return;

        await fetch(`${env.DARWIN_URL}/reply`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "X-Darwin-Secret": env.DARWIN_SECRET,
          },
          body: JSON.stringify({
            authorId: d.author.id,
            messageId: d.id,
            content: d.content,
            close,
          }),
        });
      }
    } catch (error) {
      console.error("MessageCreate handler error: ", error);
    }
  });

  await ws.connect();
  console.log("Discord listener connected and monitoring for replies...");
};

main().catch(console.error);
