var mongoose = require('mongoose');
var request = require('request');
var config = require('../lib/config/config.js');
var Track = require('../lib/models/track.js');

var count = 0;

// Connect to MongoDB for shared connection
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Delete all the tracks
clearTracksCollection(function(err) {
  if(err) {
    console.log('Error deleting DB tracks: ', err);
    return false;
  } else {
    console.log('Cleared tracks collection.');
    console.log('Getting videos.');
    getGazzzVideos(function(err) {
      if(err) {
        console.log('Error getting videos: ', err);
      } else {
        console.log('Done.');
        mongoose.disconnect();
        onComplete();
      }
    });
  }
});

// Close Mongo connection and finish
function onComplete() {
  console.log('Done.');
  mongoose.disconnect();
}

// Finds all tracks and removes them
function clearTracksCollection(callback) {
  Track.find({}).remove().exec(function(err, count) {
    callback(err, count);
  });
}

// Get all the videos in Gazzz696 'uploads' playlist
function getGazzzVideos(pageToken, callback) {
  // pageToken is optional, see if it's the callback
  if(typeof pageToken === 'function') {
    callback = pageToken;
    pageToken = null;
  }

  // YouTube API request parameters
  var params = {
    key: config.youtube.apiKey,
    part: 'snippet',
    playlistId: config.youtube.playlistId,
    maxResults: 50
  };

  // If we do have a pageToken, add it to params
  if(typeof pageToken === 'string') {
    params.pageToken = pageToken;
  }

  // YouTube API request
  request({
    uri: config.youtube.apiBase + 'playlistItems',
    json: true,
    qs: params
  }, function(err, response, body) {
    if(err) {
      callback(err);
    } else if(response.statusCode != 200) {
      callback({statusCode: response.statusCode});
    } else {
      // Save these videos
      handleYouTubePageResponse(body, function(err) {
        // If there is another page, do it all again
        if(body.nextPageToken !== undefined) {
          getGazzzVideos(body.nextPageToken, function(err) {

          });
        } else {
          callback(null);
          onComplete();
        }
      });
    }
  });
}

// Handle response from YouTube API with page of videos
function handleYouTubePageResponse(page, callback) {
  // Save all the items
  if(page.items && page.items.length > 0) {
    page.items.forEach(function(item) {
      var track = new Track();
      track.videoId = item.snippet.resourceId.videoId;
      track.title = item.snippet.title;
      track.description = item.snippet.description;
      track.publishedAt = item.snippet.publishedAt;
      track.thumbnailDefault = (item.snippet.thumbnails && item.snippet.thumbnails.default) ? item.snippet.thumbnails.default.url : undefined;
      track.thumbnailMed = (item.snippet.thumbnails && item.snippet.thumbnails.medium) ? item.snippet.thumbnails.medium.url : undefined;
      track.thumbnailHigh = (item.snippet.thumbnails && item.snippet.thumbnails.high) ? item.snippet.thumbnails.high.url : undefined;
      track.thumbnailStandard = (item.snippet.thumbnails && item.snippet.thumbnails.standard) ? item.snippet.thumbnails.standard.url : undefined;
      track.thumbnailMaxRes = (item.snippet.thumbnails && item.snippet.thumbnails.maxres) ? item.snippet.thumbnails.maxres.url : undefined;
      track.save(function(err) {
        if(err) {
          console.log('Error saving video with ID: ' + item.snippet.resourceId.videoId);
        }
      });
    });
  }

  callback();
}
