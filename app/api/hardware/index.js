'use strict';

var express = require('express'),
    controller = require('./hardware.controller.js'),
    router = express.Router();

router.get('/', controller.getAllHardware);

module.exports = router;
