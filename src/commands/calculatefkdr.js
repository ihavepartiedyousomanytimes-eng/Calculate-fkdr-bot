import { SlashCommandBuilder } from "discord.js";
import { getPlayerData } from "../services/hypixel.js";
import { calculateFKDR, finalsNeededForGoal } from "../utils/fkdr.js";

export const data = new SlashCommandBuilder()
  .setName("calculatefkdr")
  .setDescription("Calculate FKDR and finals needed to reach a goal")
  .addStringOption(opt =>
    opt.setName("username")
      .setDescription("Minecraft username")
      .setRequired(true))
  .addNumberOption(opt =>
    opt.setName("goal")
      .setDescription("Desired FKDR goal")
      .setRequired(true));

export async function execute(interaction) {
  const username = interaction.options.getString("username");
  const goal = interaction.options.getNumber("goal");

  await interaction.deferReply();

  try {
    const player = await getPlayerData(username);
    const bedwars = player.stats?.Bedwars ?? {};

    const totalFinalKills = bedwars.final_kills_bedwars ?? 0;
    const totalFinalDeaths = bedwars.final_deaths_bedwars ?? 0;

    const currentFKDR = calculateFKDR(
      totalFinalKills,
      totalFinalDeaths
    );

    const neededFinals = finalsNeededForGoal(
      totalFinalKills,
      totalFinalDeaths,
      goal
    );

    await interaction.editReply(
      `**${username}'s Bedwars FKDR Stats**\n\n` +
      `Final Kills: **${totalFinalKills}**\n` +
      `Final Deaths: **${totalFinalDeaths}**\n` +
      `Current FKDR: **${currentFKDR.toFixed(2)}**\n\n` +
      `Final kills needed to reach **${goal} FKDR**: **${neededFinals}**`
    );
  } catch (err) {
    await interaction.editReply(`❌ Error: ${err.message}`);
  }
}
