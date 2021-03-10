require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./out/commands")
  .filter((file: string) => file.endsWith(".js"));

console.log(commandFiles);

for (const file of commandFiles) {
  let command;
  if (process.env.NODE_ENV == "development") {
    command = require(`./out/commands/${file}`);
  } else {
    command = require(`./commands/${file}`);
  }

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("ready!");
});

client.on("message", (message) => {
  const prefix = "iu";

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const precommand = args.shift().toLowerCase();

  const command =
    client.commands.get(precommand) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(precommand)
    );
  if (!command) return;

  try {
    client.commands.get(command.name).execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
