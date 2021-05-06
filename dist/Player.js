"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const erela_js_1 = require("erela.js");
const events_1 = require("events");
const erela_js_spotify_1 = __importDefault(require("erela.js-spotify"));
const erela_js_deezer_1 = __importDefault(require("erela.js-deezer"));
const index_1 = require("./structures/index");
class Player extends events_1.EventEmitter {
    constructor(client, options) {
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
        this.manager = new erela_js_1.Manager({
            nodes: [
                {
                    host: this.options.host,
                    password: this.options.password,
                    retryDelay: this.options.retryDelay,
                    identifier: this.options.identifier,
                },
            ],
            plugins: [
                new erela_js_spotify_1.default({
                    clientID,
                    clientSecret,
                    albumLimit: this.options.albumLimit,
                    playlistLimit: this.options.playlistLimit,
                    convertUnresolved: this.options.convertUnresolved,
                }),
                new erela_js_deezer_1.default({
                    albumLimit: this.options.albumLimit,
                    playlistLimit: this.options.playlistLimit,
                    convertUnresolved: this.options.convertUnresolved,
                }),
            ],
            autoPlay: true,
            send: (id, payload) => {
                const guild = this.client.guilds.cache.get(id);
                if (guild)
                    guild.shard.send(payload);
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
            if (!message.guild)
                return;
            const player = this.manager.players.get(message.guild.id);
            if (!player)
                return;
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
    join(message) {
        index_1.join(this.manager, message, this.options.selfDeafen);
    }
    searchAndPlay(message, searchQuery) {
        index_1.searchAndPlay(this.player, this.manager, this.options.selfDeafen, message, searchQuery);
    }
    pause(message) {
        index_1.pauseResume(this.manager, message, true);
    }
    resume(message) {
        index_1.pauseResume(this.manager, message, false);
    }
    skip(message) {
        index_1.skip(this.manager, message);
    }
    stop(message) {
        index_1.stop(this.manager, message);
    }
    setVolume(message, volume) {
        index_1.setVolume(this.manager, message, volume);
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map