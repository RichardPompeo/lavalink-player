# lavalink-player

lavalink-player is a module to simplify the erela.js to play music in Discord.

## Installation

Using npm
```bash
npm install lavalink-player
```

Using yarn
```bash
yarn add lavalink-player
```
## Getting started

- Create an ```application.yml``` file in your working directory and copy the [example](https://github.com/freyacodes/Lavalink/blob/master/LavalinkServer/application.yml.example) into the created file and edit it with your configuration.

- Run the jar file by running ```java -jar Lavalink.jar``` in a Terminal window.

## Usage

```js
const { Client } = require("discord.js");
const { Player } = require("lavalink-player");

// Creating Discord client
const client = new Client();

// Creating player
client.player = new Player(client, { 
  token: "The bot token",
  id: "The bot id",
  clientId: "The Spotify client ID",
  clientSecret: "The Spotify client secret",
  host: "The host name",
  password: "The host password",
  identifier: "The host identifier",
  retryDelay: 5000, // Lavalink retry delay
  albumLimit: 100, // Albums limit tracks
  playlistLimit: 100, // Playlist limit tracks
  convertUnresolved: false, // Convert unresolved tracks, recommended: false
  selfDeafen: true, // Bot self deafen
});
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)