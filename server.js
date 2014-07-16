var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

// Set NODE_ENV if not passed explicitly
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Require config settings
var config = require('./lib/config/config.js');

// Connect to MongoDB for shared connection
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

// Create Express app, configure and setup routing
var app = express();
require('./lib/config/express.js')(app);
require('./lib/routes.js')(app);

// Kickoff HTTP server and Socket.IO server
app.listen(config.port, config.ip, function() {
  console.log('GazzzRadio listening on %s:%d', config.ip, config.port);
});

// Expose Express app if needed elsewhere
exports = module.exports = app;
