import { SlashCommandBuilder } from "discord.js";
import * as db from "../utils/database";

const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("View the league leaderboard");

const execute = async (interaction: any) => {
  const leaderboard = await db.getLeaderboardData();
  if (leaderboard.length === 0) {
    await interaction.reply(
      "No scores yet! Solve daily problems to appear on the leaderboard",
    );
    return;
  }
  let message = "🏆 **Leaderboard** 🏆\n\n";
  leaderboard.forEach((user: any, index: number) => {
    message += `**${index + 1}.** <@${user.discordId}> (${user.codeforcesHandle}) - ${user.points} points\n`;
  });
  await interaction.reply(message);
};

export default { data, execute };
