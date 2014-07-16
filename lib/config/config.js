var path = require('path');

var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
  root: rootPath,
  ip: '0.0.0.0',
  port: '3030',
  mongo: {
    uri: 'mongodb://127.0.0.1/gazzzradio',
    options: {
      db: {
        safe: true
      }
    }
  },
  youtube: {
    apiKey: "AIzaSyAbUJ72YIPJ69kAzgaLAiiAGt1SaVV6x-s",
    apiBase: "https://www.googleapis.com/youtube/v3/",
    username: "Gazzz696",
    channelId: "UC2GK1jS6xrYTh4Xo9qsYSgQ",
    playlistId: "UU2GK1jS6xrYTh4Xo9qsYSgQ"
  }
};
