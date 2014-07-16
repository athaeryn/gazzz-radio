var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define the model Schema
var TrackSchema = new Schema({

  videoId: {type: String, required: true, unique: true},
  title: {type: String, required: true},
  description: {type: String, default: 'Not provided.'},
  publishedAt: {type: Date, required: true},
  thumbnailDefault: String,
  thumbnailMed: String,
  thumbnailHigh: String,
  thumbnailStandard: String,
  thumbnailMaxRes: String

});

TrackSchema.statics.random = function(callback) {
  this.count(function(err, count) {
    if(err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(callback);
  }.bind(this));
};

module.exports = mongoose.model('Track', TrackSchema);
