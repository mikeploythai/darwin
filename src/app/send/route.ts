import { DiscordAPIError, REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { type NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN is missing");

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

export async function GET({ headers }: NextRequest) {
	const authHeader = headers.get("authorization");

	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response("Unauthorized", {
			status: 401,
		});
	}

	try {
		if (!CHANNEL_ID) throw new Error("CHANNEL_ID is missing");
		await rest.post(Routes.channelMessages(CHANNEL_ID), {
			body: {
				content: "A message via REST!",
			},
		});
		return new Response("Message sent!");
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error },
			{ status: error instanceof DiscordAPIError ? error.status : 400 },
		);
	}
}
