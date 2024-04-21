module.exports = {
  TOKEN: "",
  ownerID: ["976963107660365854", ""],
  botInvite: "",
  supportServer: "https://discord.gg/cWr9xqxB5N",
  mongodbURL: "mongodb+srv://ikoko29874:ikoko29874@musicbot.awahqlc.mongodb.net/?retryWrites=true&w=majority",
  status: 'FG Music',
  commandsDir: './commands',
  language: "en",
  embedColor: "0000ff",
  errorLog: "",


  sponsor: {
    status: false,
    url: "",
  },

  voteManager: {
    status: false,
    api_key: "",
    vote_commands: ["back", "channel", "clear", "dj", "filter", "loop", "nowplaying", "pause", "playnormal", "playlist", "queue", "resume", "save", "play", "skip", "stop", "time", "volume"],
    vote_url: "",
  },

  shardManager: {
    shardStatus: false
  },

  playlistSettings: {
    maxPlaylist: 10,
    maxMusic: 75,
  },

  opt: {
    DJ: {
      commands: ['back', 'clear', 'filter', 'loop', 'pause', 'resume', 'skip', 'stop', 'volume', 'shuffle']
    },

    voiceConfig: {
      leaveOnFinish: false,
      leaveOnStop: false,
      leaveOnEmpty: {
        status: true,
        cooldown: 10000000,
      },

    },

    maxVol: 150,

  }
}
