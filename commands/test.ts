import { Message } from "discord.js";

module.exports = {
  name: "test",
  execute(message: Message, args, client) {
    message.channel.send("test");
  },
};
