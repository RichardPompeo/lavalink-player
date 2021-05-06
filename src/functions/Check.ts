import { Message } from "discord.js";
import { Manager } from "erela.js";

function check(manager: Manager, message: Message) {
  const player = manager.players.get(message.guild!.id);

  if (!player) {
    throw new Error(`This guild (${message.guild!.id}) doesn't have a player.`);
  }

  return player;
}

export default check;
