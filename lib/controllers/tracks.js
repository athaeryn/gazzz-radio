var mongoose = require('mongoose');
var Track = mongoose.model('Track');

// Find all tracks
exports.findAll = function(req, res, next) {
  Track.find({}).lean().exec(function(err, tracks) {
    if(err) return next(err);

    return res.json(tracks);
  });
};

// Get 1 random track
exports.randomTrack = function(req, res, next) {
  Track.random(function(err, track) {
    if(err) return next(err);

    return res.json(track);
  });
};
