const { Client } = require("discord.js");
const { Player } = require("../dist/index");

const client = new Client();

const player = new Player(client, {
  token: "NzEyNzg1OTU4MjMxMDgwOTkw.XsWnpw.CA9cx9Yi-dYNbhbBFoPMPiB-77w",
  id: "712785958231080990",
  clientId: "031c8c19932e4b0bb3d2ffffe46a9afe",
  clientSecret: "f4b524cc250f465a81b5a5c28704c78f",
  host: "localhost",
  password: "grove",
  retryDelay: 5000,
  identifier: "bot",
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

client.login("NzEyNzg1OTU4MjMxMDgwOTkw.XsWnpw.CA9cx9Yi-dYNbhbBFoPMPiB-77w");
