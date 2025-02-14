import { SlashCommandBuilder } from "discord.js";
import * as db from "../utils/database";

const data = new SlashCommandBuilder()
  .setName("link")
  .setDescription("Link your Codeforces account to your Discord account")
  .addStringOption((option) =>
    option
      .setName("handle")
      .setDescription("Your Codeforces username")
      .setRequired(true),
  );

const execute = async (interaction: any) => {
  const handle = interaction.options.getString("handle");
  const discordId = interaction.user.id;

  await db.linkUser(discordId, handle);
  await interaction.reply(`✅ Linked **${handle}** to your Discord account!`);
};

export default {
  data,
  execute,
};
