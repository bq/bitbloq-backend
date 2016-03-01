/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var express = require('express');
var router = express.Router();

module.exports = function (app) {

    // Insert routes below
    // router.use('/api/projects', require('./api/project/'));
    // router.use('/api/images', require('./api/image/'));
    router.use('/api/users', require('./api/user'));
    router.use('/api/auth', require('./components/auth'));
    
    // Laura's Jade Views
    // router.use('/local/project', require('./local/crud'));
    // router.use('/local/api/project', require('./local/api'));

    // Set a prefix for all calls
    app.use('/bitbloq/v1', router);
    
    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);
};