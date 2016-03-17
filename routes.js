/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var express = require('express');
var router = express.Router();

module.exports = function(app) {

    // Insert routes below
    // router.use('/api/projects', require('./api/project/'));
    // router.use('/api/images', require('./api/image/'));
    router.use('/users', require('./api/user'));
    router.use('/project', require('./api/project'));
    router.use('/auth', require('./components/auth'));
    router.use('/mailer', require('./api/mailer'));

    // Set a prefix for all calls
    app.use('/bitbloq/v1', router);

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);
};