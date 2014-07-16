var index = require('./controllers/index.js');
var tracks = require('./controllers/tracks.js');
var youtube = require('./controllers/youtube.js');

module.exports = function(app) {

  //-- API Routes --//
  app.route('/api/channel')
    .get(youtube.getChannelDetails);

  app.route('/api/tracks')
    .get(tracks.findAll);

  app.route('/api/tracks/random')
    .get(tracks.randomTrack);

  //-- All undefined api routes should return a 404 --//
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    })
    .post(function(req, res) {
      res.send(404);
    })
    .put(function(req, res) {
      res.send(404);
    })
    .delete(function(req, res) {
      res.send(404);
    });

  //-- All other routes to use Angular routing in app/scripts/app.js --//
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get(index.index);
};
