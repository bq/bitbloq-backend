'use strict';

var express = require('express'),
    controller = require('./component.controller.js'),
    router = express.Router();

router.get('/', controller.get);

module.exports = router;
