/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors/index');
var express = require('express');
var router = express.Router();

module.exports = function(app) {

    // Insert routes below
    // router.use('/api/images', require('./api/image/'));
    router.use('/user', require('./api/user/index'));
    router.use('/project', require('./api/project/index'));
    router.use('/auth', require('./components/auth/index'));
    router.use('/forum', require('./api/forum/index'));
    router.use('/bloq', require('./api/bloq/index'));
    router.use('/property', require('./api/property/index'));
    router.use('/version', require('./api/version/index'));
    router.use('/image', require('./api/image/index'));
    router.use('/faq', require('./api/faq/index'));
    router.use('/changelog', require('./api/changelog/index'));
    router.use('/feedback', require('./api/feedback/index'));
    router.use('/robotsFirmware', require('./api/robotsFirmware/index'));
    router.use('/board', require('./api/hardware/board/index'));
    router.use('/component', require('./api/hardware/component/index'));
    router.use('/kit', require('./api/hardware/kit/index'));
    router.use('/robot', require('./api/hardware/robot/index'));

    // Set a prefix for all calls
    app.use('/bitbloq/v1', router);

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);
};
