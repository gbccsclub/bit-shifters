import { SlashCommandBuilder } from "discord.js";
import * as db from "../utils/database";

const data = new SlashCommandBuilder()
  .setName("solve")
  .setDescription("Check if you have solved today's daily problem");

const execute = async (interaction: any) => {
  const discordId = interaction.user.id;
  const isSolved = await db.checkSolve(discordId);
  await interaction.reply(isSolved.message);
};

export default {
  data,
  execute,
};
