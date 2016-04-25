/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var express = require('express');
var router = express.Router();

module.exports = function(app) {

    // Insert routes below
    // router.use('/api/images', require('./api/image/'));
    router.use('/user', require('./api/user'));
    router.use('/project', require('./api/project'));
    router.use('/auth', require('./components/auth'));
    router.use('/mailer', require('./api/mailer'));
    router.use('/forum', require('./api/forum'));
    router.use('/bloq', require('./api/bloq'));
    router.use('/property', require('./api/property'));
    router.use('/image', require('./api/image'));

    // Set a prefix for all calls
    app.use('/bitbloq/v1', router);

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);
};
