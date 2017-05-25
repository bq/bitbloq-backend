/* global process */
/**
 * Main application file
 */

'use strict';


var express = require('express'),
    mongoose = require('mongoose'),
    config = require('./res/config.js'),
    http = require('http'),
    mailer = require('./components/mailer');

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error : ' + err);
    process.exit(-1);
});

// Setup server
var app = express(),
    server = http.createServer(app);

require('./express')(app);
require('./routes')(app);

// Start server
function startServer() {
    server.listen(config.port, config.ip, function() {
        console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    });
}

process.on('uncaughtException', function(err, arg1, arg2) {
    console.log(err);
    var now = new Date(),
        locals = {
        email: config.emailTObbc,
        subject: 'Fallo en la api - backend de Bitbloq',
        date: now,
        err: err
    };

    mailer.sendOne('error', locals, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent at ', now);
        }
    });
});


setImmediate(startServer);

// Expose app
exports = module.exports = app;
