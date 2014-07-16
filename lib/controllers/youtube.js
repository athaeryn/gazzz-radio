var request = require('request');
var config = require('../config/config.js');

// Get Gazz696 channel details
exports.getChannelDetails = function(req, res, next) {
  ytAPIRequest('channels', {
    part: 'snippet',
    forUsername: config.youtube.username
  }, function(err, data) {
    if(err) return next(err);

    res.json(data);
  });
};



// Generic YouTube API request function
function ytAPIRequest(path, params, cb) {
  params.key = config.youtube.apiKey;
  request({
    uri: config.youtube.apiBase + path,
    qs: params,
    json: true
  }, function(err, res, body) {
    if(err) {
      return cb(err);
    } else if(!res.statusCode == 200) {
      return cb({statusCode: res.statusCode});
    }

    return cb(null, body);
  });
}
