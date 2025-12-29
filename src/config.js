import dotenv from "dotenv";
dotenv.config();

export const config = {
  discordToken: process.env.DISCORD_TOKEN,
  hypixelApiKey: process.env.HYPIXEL_API_KEY,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID
};
