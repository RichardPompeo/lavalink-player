import { Message } from "discord.js";
import { Manager } from "erela.js";
import check from "../functions/Check";
import { Player } from "../Player";

async function join(manager: Manager, message: Message, selfDeafen: boolean) {
  const { channel } = message.member!.voice;

  let play = manager.players.get(message.guild!.id);

  if (!play) {
    const player = manager.create({
      guild: message.guild!.id,
      voiceChannel: channel!.id,
      textChannel: message.channel.id,
      selfDeafen: selfDeafen,
    });

    player.connect();
  } else {
    throw new Error(`The guild (${message.guild!.id}) already has a player.`);
  }
}

async function searchAndPlay(
  playerClient: Player,
  manager: Manager,
  selfDeafen: boolean,
  message: Message,
  searchQuery: string
) {
  const { channel } = message.member!.voice;

  let play = manager.players.get(message.guild!.id);

  if (!play) {
    const player = manager.create({
      guild: message.guild!.id,
      voiceChannel: channel!.id,
      textChannel: message.channel.id,
      selfDeafen: selfDeafen,
    });

    player.connect();
  }

  const player = manager.players.get(message.guild!.id);
  let res;

  try {
    res = await player!.search(searchQuery, message.author);

    if (res.loadType === "LOAD_FAILED") {
      if (!player!.queue.current) player!.destroy();

      playerClient.emit("LOAD_FAILED", message.channel, searchQuery);
    }
  } catch (err) {
    throw new Error(err);
  }

  switch (res.loadType) {
    case "NO_MATCHES":
      if (!player!.queue.current) player!.destroy();

      playerClient.emit("NO_MATCHES", message.channel, searchQuery);
      break;
    case "TRACK_LOADED":
      await player!.queue.add(res.tracks[0]);

      if (!player!.playing && !player!.paused && !player!.queue.length) {
        player!.play();
      }

      playerClient.emit(
        "TRACK_LOADED",
        message.channel,
        searchQuery,
        res.tracks[0]
      );
      break;
    case "PLAYLIST_LOADED":
      await player!.queue.add(res.tracks);

      if (
        !player!.playing &&
        !player!.paused &&
        player!.queue.size + 1 === res.tracks.length
      ) {
        player!.play();
      }

      playerClient.emit(
        "PLAYLIST_LOADED",
        message.channel,
        searchQuery,
        res.tracks
      );
      break;
    case "SEARCH_RESULT":
      await player!.queue.add(res.tracks[0]);

      if (!player!.playing && !player!.paused && !player!.queue.length) {
        player!.play();
      }

      playerClient.emit(
        "SEARCH_RESULT",
        message.channel,
        searchQuery,
        res.tracks[0]
      );
      break;
  }
}

function pauseResume(manager: Manager, message: Message, cond: boolean) {
  const player = check(manager, message);

  player.pause(cond);
}

function skip(manager: Manager, message: Message) {
  const player = check(manager, message);

  player.stop();
}

function stop(manager: Manager, message: Message) {
  const player = check(manager, message);

  player.destroy();
}

function setVolume(manager: Manager, message: Message, volume: number) {
  const player = check(manager, message);

  if (volume < 0 || volume > 200) {
    throw new Error(
      `The volume ${volume} is invalid. The volume can be "0 - 200"`
    );
  }

  player.setVolume(volume);
}

export { pauseResume, searchAndPlay, skip, stop, join, setVolume };
