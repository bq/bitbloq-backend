'use strict';

var express = require('express'),
    controller = require('./kit.controller.js'),
    router = express.Router();

router.get('/', controller.get);

module.exports = router;
