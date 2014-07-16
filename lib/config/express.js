var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var config = require('./config.js');

module.exports = function(app) {
  app.use(express.static(path.join(config.root, 'app')));
  app.set('views', config.root + '/app/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(morgan('dev'));
  app.use(bodyParser());
};
