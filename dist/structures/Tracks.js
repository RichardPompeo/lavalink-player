"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVolume = exports.join = exports.stop = exports.skip = exports.searchAndPlay = exports.pauseResume = void 0;
const Check_1 = __importDefault(require("../functions/Check"));
async function join(manager, message, selfDeafen) {
    const { channel } = message.member.voice;
    let play = manager.players.get(message.guild.id);
    if (!play) {
        const player = manager.create({
            guild: message.guild.id,
            voiceChannel: channel.id,
            textChannel: message.channel.id,
            selfDeafen: selfDeafen,
        });
        player.connect();
    }
    else {
        throw new Error(`The guild (${message.guild.id}) already has a player.`);
    }
}
exports.join = join;
async function searchAndPlay(playerClient, manager, selfDeafen, message, searchQuery) {
    const { channel } = message.member.voice;
    let play = manager.players.get(message.guild.id);
    if (!play) {
        const player = manager.create({
            guild: message.guild.id,
            voiceChannel: channel.id,
            textChannel: message.channel.id,
            selfDeafen: selfDeafen,
        });
        player.connect();
    }
    const player = manager.players.get(message.guild.id);
    let res;
    try {
        res = await player.search(searchQuery, message.author);
        if (res.loadType === "LOAD_FAILED") {
            if (!player.queue.current)
                player.destroy();
            playerClient.emit("LOAD_FAILED", message.channel, searchQuery);
        }
    }
    catch (err) {
        throw new Error(err);
    }
    switch (res.loadType) {
        case "NO_MATCHES":
            if (!player.queue.current)
                player.destroy();
            playerClient.emit("NO_MATCHES", message.channel, searchQuery);
            break;
        case "TRACK_LOADED":
            await player.queue.add(res.tracks[0]);
            if (!player.playing && !player.paused && !player.queue.length) {
                player.play();
            }
            playerClient.emit("TRACK_LOADED", message.channel, searchQuery, res.tracks[0]);
            break;
        case "PLAYLIST_LOADED":
            await player.queue.add(res.tracks);
            if (!player.playing &&
                !player.paused &&
                player.queue.size + 1 === res.tracks.length) {
                player.play();
            }
            playerClient.emit("PLAYLIST_LOADED", message.channel, searchQuery, res.tracks);
            break;
        case "SEARCH_RESULT":
            await player.queue.add(res.tracks[0]);
            if (!player.playing && !player.paused && !player.queue.length) {
                player.play();
            }
            playerClient.emit("SEARCH_RESULT", message.channel, searchQuery, res.tracks[0]);
            break;
    }
}
exports.searchAndPlay = searchAndPlay;
function pauseResume(manager, message, cond) {
    const player = Check_1.default(manager, message);
    player.pause(cond);
}
exports.pauseResume = pauseResume;
function skip(manager, message) {
    const player = Check_1.default(manager, message);
    player.stop();
}
exports.skip = skip;
function stop(manager, message) {
    const player = Check_1.default(manager, message);
    player.destroy();
}
exports.stop = stop;
function setVolume(manager, message, volume) {
    const player = Check_1.default(manager, message);
    if (volume < 0 || volume > 200) {
        throw new Error(`The volume ${volume} is invalid. The volume can be "0 - 200"`);
    }
    player.setVolume(volume);
}
exports.setVolume = setVolume;
//# sourceMappingURL=Tracks.js.map