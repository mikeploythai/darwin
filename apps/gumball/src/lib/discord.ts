import { REST } from "@discordjs/rest";
import env from "./env.ts";

export const discord = new REST({ version: "10" }).setToken(env.BOT_TOKEN);
