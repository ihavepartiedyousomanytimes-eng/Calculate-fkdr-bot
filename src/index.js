import { Client, Collection, GatewayIntentBits, REST, Routes } from "discord.js";
import { config } from "./config.js";
import { data as fkdrData, execute as fkdrExecute } from "./commands/calculatefkdr.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();
client.commands.set(fkdrData.name, {
  data: fkdrData,
  execute: fkdrExecute
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  await command.execute(interaction);
});

const rest = new REST({ version: "10" }).setToken(config.discordToken);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(config.clientId, config.guildId),
    { body: [fkdrData.toJSON()] }
  );
  client.login(config.discordToken);
})();
