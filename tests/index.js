const { Client } = require("discord.js");
const { Player } = require("../dist/index");
require("dotenv").config();

const client = new Client();

const player = new Player(client, {
  token: process.env.TOKEN,
  id: process.env.ID,
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  identifier: process.env.IDENTIFIER,
  retryDelay: 5000,
  albumLimit: 100,
  playlistLimit: 100,
  convertUnresolved: false,
  selfDeafen: true,
});

client.on("message", (msg) => {
  if (!msg.guild) return;

  let messageArray = msg.content.split(" ");
  let args = messageArray.slice(1);

  if (msg.content.startsWith("play")) {
    player.searchAndPlay(msg, args.join(" "));
  }

  if (msg.content.startsWith("pause")) {
    player.pause(msg);
  }

  if (msg.content.startsWith("volume")) {
    player.setVolume(msg, args.join(" "));
  }

  if (msg.content.startsWith("get")) {
    console.log(player.op.volume);
  }
});

player

  .on("NODE_CONNECT", (node) => {
    console.log(`[NODE] - ${node.options.identifier} conectado.`);
  })

  .on("SEARCH_RESULT", (channel, query, track) => {
    channel.send(`Encontrado por ${query} -- ${track.title}`);
  })

  .on("TRACK_LOADED", (channel, query, track) => {
    channel.send(`Loaded from ${query} -- ${track.title}`);
  })

  .on("TRACK_START", (player, track) => {
    client.channels.cache.get(player.textChannel).send(track.title);
  });

client.login(process.env.TOKEN);
