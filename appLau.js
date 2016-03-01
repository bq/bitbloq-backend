'use strict';

var path = require('path');
var express = require('express');
var cors = require('cors');
var session = require('cookie-session');
var config = require('./config/config')();
var logging = require('./components/logging')();

var app = express();

app.disable('etag');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('trust proxy', true);

// Add the request logger before anything else so that it can
// accurately log requests.
app.use(logging.requestLogger);

app.use(cors());



// Configure the session and session storage.
// MemoryStore isn't viable in a multi-server configuration, so we
// use encrypted cookies. Redis or Memcache is a great option for
// more secure sessions, if desired.
app.use(session({
  secret: config.secret,
  signed: true
}));

// OAuth2
var oauth2 = require('./components/oauth2')(config.oauth2);
app.use(oauth2.router);

// Setup modules and dependencies
var background = require('./components/background')(config.gcloud, logging);
var images = require('./components/images')(
  config.gcloud,
  config.cloudStorageBucket,
  logging
);
var model = require('./api/project/model')(config, background);

// Projects
app.use('/project', require('./api/project/crud')(model, images, oauth2));
app.use('/api/project', require('./api/project/api')(model));


// Jade View
app.use('/local/project', require('./local/crud')(model, images, oauth2));
app.use('/local/api/project', require('./local/api')(model));

// Redirect root to /project
/*app.get('/', function (req, res) {
  res.redirect('/project');
});*/
//
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:9000");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});



app.get('/test/:id', function (req, res) {
  console.log('test: END POINT');
  res.status(200).json({ projectId: req.params.id});
});


// Our application will need to respond to health checks when running on
// Compute Engine with Managed Instance Groups.
app.get('/_ah/health', function (req, res) {
  res.status(200).send('ok');
});

// Add the error logger after all middleware and routes so that
// it can log errors from the whole application. Any custom error
// handlers should go after this.
app.use(logging.errorLogger);

// Basic 404 handler
app.use(function (req, res) {
  res.status(404).send('Not Found');
});

// Basic error handler
app.use(function (err, req, res, next) {
  /* jshint unused:false */
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || 'Something broke!');
});

if (module === require.main) {
  // Start the server
  var server = app.listen(config.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
  });
}

module.exports = app;
