'use strict';

var express = require('express'),
    controller = require('./board.controller.js'),
    router = express.Router();

router.get('/', controller.get);

module.exports = router;
