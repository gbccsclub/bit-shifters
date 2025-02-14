import { SlashCommandBuilder } from "discord.js";
import * as db from "../utils/database";

const data = new SlashCommandBuilder()
  .setName("daily")
  .setDescription("Get today's daily problem");

const execute = async (interaction: any) => {
  const problem = await db.getDailyProblem();
  let message = "⚡ **Daily Challenge** ⚡\n";
  message += `Date: ${new Date().toDateString()}\nDifficulty: ${problem.difficulty}\n`;
  message += `[${problem.name}](${problem.url})\nTags: ${problem.tags.map((tag) => `\`${tag}\``).join(", ")}\n`;
  await interaction.reply(message);
};

export default {
  data,
  execute,
};
