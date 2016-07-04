'use strict';

var express = require('express'),
    controller = require('./feedback.controller.js');

var router = express.Router();

router.post('/', controller.send);

module.exports = router;
