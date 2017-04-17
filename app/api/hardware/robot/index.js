'use strict';

var express = require('express'),
    controller = require('./robot.controller.js'),
    router = express.Router();

router.get('/', controller.get);

module.exports = router;
