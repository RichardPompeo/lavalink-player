import { Client, Message } from "discord.js";
import { Manager } from "erela.js";
import { EventEmitter } from "events";
import Spotify from "erela.js-spotify";
import Deezer from "erela.js-deezer";

import { ClientOptions, OP } from "./interfaces/index";

import {
  join,
  pauseResume,
  searchAndPlay,
  setVolume,
  skip,
  stop,
} from "./structures/index";

export class Player extends EventEmitter {
  protected options: ClientOptions;
  protected client: Client;
  protected manager: Manager;
  protected player: any;
  protected clientID: string;
  protected clientSecret: string;

  protected op: OP | undefined;

  constructor(client: Client, options: ClientOptions) {
    super();

    this.client = client;
    this.options = options;
    this.player = this;
    this.clientID = options.clientId;
    this.clientSecret = options.clientSecret;

    if (!options.retryDelay) {
      this.options.retryDelay = 5000;
    }

    const clientID = this.clientID;
    const clientSecret = this.clientSecret;

    this.client.on("raw", (d) => {
      this.manager.updateVoiceState(d);
    });

    this.manager = new Manager({
      nodes: [
        {
          host: this.options.host,
          password: this.options.password,
          retryDelay: this.options.retryDelay,
          identifier: this.options.identifier,
        },
      ],
      plugins: [
        new Spotify({
          clientID,
          clientSecret,
          albumLimit: this.options.albumLimit,
          playlistLimit: this.options.playlistLimit,
          convertUnresolved: this.options.convertUnresolved,
        }),
        new Deezer({
          albumLimit: this.options.albumLimit,
          playlistLimit: this.options.playlistLimit,
          convertUnresolved: this.options.convertUnresolved,
        }),
      ],
      autoPlay: true,
      send: (id, payload) => {
        const guild = this.client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    })

      .on("nodeCreate", (node) => {
        this.emit("NODE_CREATE", node);
      })

      .on("nodeDestroy", (node) => {
        this.emit("NODE_DESTROY", node);
      })

      .on("nodeConnect", (node) => {
        this.emit("NODE_CONNECT", node);
      })

      .on("nodeReconnect", (node) => {
        this.emit("NODE_RECONNECT", node);
      })

      .on("nodeDisconnect", (node, reason) => {
        this.emit("NODE_DISCONNECT", node, reason);
      })

      .on("nodeError", (node, error) => {
        this.emit("NODE_ERROR", node, error);
      })

      .on("nodeRaw", (payload) => {
        this.emit("NODE_RAW", payload);
      })

      .on("playerCreate", (player) => {
        this.emit("PLAYER_CREATE", player);
      })

      .on("playerDestroy", (player) => {
        this.emit("PLAYER_DESTROY", player);
      })

      .on("playerMove", (player, oldChannel, newChannel) => {
        this.emit("PLAYER_MOVE", player, oldChannel, newChannel);
      })

      .on("queueEnd", (player) => {
        this.emit("QUEUE_END", player);
      })

      .on("trackStart", (player, track, payload) => {
        this.emit("TRACK_START", player, track, payload);
      })

      .on("trackEnd", (player, track, payload) => {
        this.emit("TRACK_END", player, track, payload);
      })

      .on("trackStuck", (player, track, payload) => {
        this.emit("TRACK_STUCK", player, track, payload);
      })

      .on("trackError", (player, track, payload) => {
        this.emit("TRACK_ERROR", player, track, payload);
      })

      .on("socketClosed", (player, payload) => {
        this.emit("SOCKET_CLOSED", player, payload);
      });

    this.client.once("ready", () => {
      this.manager.init(this.options.id);
    });

    this.client.on("message", (message) => {
      if (!message.guild) return;

      const player = this.manager.players.get(message.guild.id);

      if (!player) return;

      this.op = {
        textChannel: player.textChannel,
        voiceChannel: player.voiceChannel,
        position: player.position,
        volume: player.volume,
        paused: player.paused,
        playing: player.playing,
        state: player.state,
        queue: player.queue,
        trackRepeat: player.trackRepeat,
        queueRepeat: player.queueRepeat,
        voiceState: player.voiceState,
      };
    });
  }

  join(message: Message) {
    join(this.manager, message, this.options.selfDeafen);
  }

  searchAndPlay(message: Message, searchQuery: string) {
    searchAndPlay(
      this.player,
      this.manager,
      this.options.selfDeafen,
      message,
      searchQuery
    );
  }

  pause(message: Message) {
    pauseResume(this.manager, message, true);
  }

  resume(message: Message) {
    pauseResume(this.manager, message, false);
  }

  skip(message: Message) {
    skip(this.manager, message);
  }

  stop(message: Message) {
    stop(this.manager, message);
  }

  setVolume(message: Message, volume: number) {
    setVolume(this.manager, message, volume);
  }
}
