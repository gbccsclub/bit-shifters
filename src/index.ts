import dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import commands from "./commands";
import { connectToDb } from "./utils/database";

async function main() {
  // init discord bot
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  // connect to mongoDB
  await connectToDb();

  // create command collection
  client.once("ready", async () => {
    console.log(`Bot is ready. Logged in as ${client.user?.tag}`);
    const botCommands = [
      commands.linkAccount.data,
      commands.daily.data,
      commands.solve.data,
      commands.leaderboard.data,
    ].map((command) => command.toJSON());
    // register commands with API
    const rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_TOKEN!,
    );
    try {
      await rest.put(Routes.applicationCommands(client.user!.id), {
        body: botCommands,
      });
      console.log("Successfully registered application commands");
    } catch (err) {
      console.error("Failed to register commands", err);
    }
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    console.log(`Received command: ${interaction.commandName}`);
    // await interaction.deferReply({ ephemeral: true });
    const { commandName } = interaction;

    switch (commandName) {
      case "link":
        await commands.linkAccount.execute(interaction);
        break;
      case "daily":
        await commands.daily.execute(interaction);
        break;
      case "solve":
        await commands.solve.execute(interaction);
        break;
      case "leaderboard":
        await commands.leaderboard.execute(interaction);
        break;
    }
  });

  client.login(process.env.DISCORD_TOKEN);
}

main();
